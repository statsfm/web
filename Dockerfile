########################################
# BASE #################################
########################################
FROM node:20.16.0-alpine as base

ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production YARN_VERSION=4.1.1

RUN apk update && apk upgrade && apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare yarn@${YARN_VERSION}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

#########################################
# BUILD #################################
#########################################
FROM base AS builder

WORKDIR /app

COPY . .
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn

RUN yarn install --immutable
RUN yarn build

#########################################
# RELEASE ###############################
#########################################
FROM base AS runner

WORKDIR /app

COPY --from=builder  --chown=nextjs:nodejs /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/src/pages/fonts ./src/pages/fonts

USER nextjs

EXPOSE 3000

ENV HOSTNAME=0.0.0.0 PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "--inspect=9229", "server.js"]
