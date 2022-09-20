import { Container } from '@/components/Container';
import type { GetStaticProps, NextPage } from 'next';
import fs from 'node:fs/promises';
import remarkHtml from 'remark-html';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

type Props = {
  content: string;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const text = await fs.readFile('static/terms.md', 'utf8');

  const content = await unified()
    .use(remarkParse)
    .use(remarkHtml)
    .process(text);

  return {
    props: {
      content: String(content),
    },
  };
};

const TermsPage: NextPage<Props> = ({ content }) => {
  return (
    <Container>
      <article
        className="prose max-w-full pt-32 font-medium text-neutral-400 prose-headings:text-white prose-a:text-primary prose-li:my-0.5"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </Container>
  );
};

export default TermsPage;
