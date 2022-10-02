import { ChevronLink } from '@/components/ChevronLink';
import { Container } from '@/components/Container';
import { CrownIcon } from '@/components/CrownIcon';
import { Title } from '@/components/Title';
import Link from 'next/link';

const plusPage = () => {
  return (
    <>
      <Title>plus</Title>
      <Container className="flex flex-col justify-between gap-5 pt-20 lg:flex-row">
        <div className="my-12 w-full pt-10 lg:my-28 lg:w-4/12">
          <h1 className="flex items-center text-5xl leading-none">
            Stats.fm Plus{' '}
            <CrownIcon className="ml-3 inline-block h-auto w-12" />
          </h1>
          <p className="mt-4 font-medium">
            Get full insight in your past and get the most accurate stats for
            your favorite music app today!
          </p>

          <Link href="/gift">
            <a className="mt-12 block w-fit rounded-2xl bg-plus px-5 py-3 font-bold text-black hover:bg-plus/90 active:bg-plus/75">
              Get stats.fm plus!
            </a>
          </Link>
        </div>
      </Container>
      <section className="bg-foreground py-36">
        <Container className="flex flex-wrap gap-10">
          <div className="w-full shrink-0 rounded-2xl bg-background p-10">
            <div className="w-1/2">
              <h2>Import your history</h2>
              <p className="mt-8">
                Import your spotify history, <br />
                this feature allows you to import your entire spotify listening
                history. <br />
                <br />
                Follow our unique import process with your special requested
                files from spotify. <br />
                When imported succesfully your stats.fm account will be 100%
                accurate from the day you started streaming your favorite
                artists!
              </p>
              <ChevronLink href="/gift">Get </ChevronLink>
            </div>
          </div>
          <div className="flex w-full gap-10">
            <div className="w-full rounded-2xl bg-background p-10">hello</div>
            <div className="w-full rounded-2xl bg-background p-10">hello</div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default plusPage;
