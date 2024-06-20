import { Container } from '@/components/Container';
import { Title } from '@/components/Title';
import type { GetStaticProps, NextPage } from 'next';
import fs from 'node:fs/promises';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

type Props = {
  content: string;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const text = await fs.readFile('static/ccpa.md', 'utf8');

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

const CCPAPage: NextPage<Props> = ({ content }) => {
  return (
    <Container>
      <Title>CCPA</Title>
      <article
        className="prose max-w-full pt-32 font-medium text-neutral-400 prose-headings:text-white prose-a:text-primary prose-strong:text-white prose-li:my-0.5"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Container>
  );
};

export default CCPAPage;
