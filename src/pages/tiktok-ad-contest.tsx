import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import type { GetStaticProps, NextPage } from 'next';
import fs from 'node:fs/promises';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

type Props = {
  content: string;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const text = await fs.readFile('static/tiktok-ad-contest.md', 'utf8');

  const content = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings)
    .use(rehypeStringify)
    .process(text);

  return {
    props: {
      content: String(content),
    },
  };
};

const ContestPage: NextPage<Props> = ({ content }) => {
  return (
    <Container>
      <Title>stats.fm TikTok Ad Contest Rules and Privacy Notice</Title>
      <article
        className="prose max-w-full pt-32 font-medium text-neutral-400 prose-headings:text-white prose-a:text-primary prose-strong:text-neutral-300 prose-li:my-0.5"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Container>
  );
};

export default ContestPage;
