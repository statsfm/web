import Link from 'next/link';
import { event } from 'nextjs-google-analytics';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/router';
import { Container } from './Container';
import { StoreBadge } from './StoreBadges';

const links: { label: string; links: { label: string; href: string }[] }[] = [
  {
    label: 'stats.fm',
    links: [
      {
        label: 'Home',
        href: '/',
      },
      {
        label: 'Support',
        href: 'https://support.stats.fm/',
      },
      {
        label: 'Beta program',
        href: '/beta',
      },
      {
        label: 'Credits',
        href: '/credits',
      },
      // {
      //   label: 'Plus',
      //   // href: '/plus',
      // },
    ],
  },
  {
    label: 'Socials',
    links: [
      {
        label: 'Discord',
        href: 'https://stats.fm/discord',
      },
      {
        label: 'Twitter',
        href: 'https://twitter.com/spotistats',
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/statsfm/',
      },
    ],
  },
  {
    label: 'Legal',
    links: [
      {
        label: 'Privacy',
        href: '/privacy',
      },
      {
        label: 'Terms',
        href: '/terms',
      },
    ],
  },
];

export const Footer = () => {
  const { user } = useAuth();
  const { pathname } = useRouter();

  return (
    <Container as="footer" className="py-14">
      <div className="grid grid-cols-2 gap-y-4 lg:flex lg:flex-row lg:justify-between">
        {links.map((cat, i) => (
          <div key={i} className="ml-4 flex flex-col lg:ml-0">
            <h4 className="mb-2 text-text-grey">{cat.label}</h4>
            <ul className="grid gap-2">
              {cat.links.map((link, i) => (
                <li key={i}>
                  {link.href.startsWith('https://') ? (
                    <a
                      href={link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                      onClick={
                        cat.label === 'Socials'
                          ? () =>
                              event(`FOOTER_${link.label.toLowerCase()}_click`)
                          : undefined
                      }
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      legacyBehavior
                      href={link.href}
                      className="text-[1rem]"
                    >
                      <a
                        onClick={
                          cat.label === 'Socials'
                            ? () =>
                                event(
                                  `FOOTER_${link.label.toLowerCase()}_click`
                                )
                            : undefined
                        }
                      >
                        {link.label}
                      </a>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="ml-4 h-48 lg:ml-0">
          <h4 className="text-text-grey">Download</h4>
          <div className="mt-4"></div>
          <StoreBadge
            store="apple"
            size="xs"
            onClick={() => event('FOOTER_appstore')}
          />
          <div className="mt-2"></div>
          <StoreBadge
            store="google"
            size="xs"
            onClick={() => event('FOOTER_playstore')}
          />
        </div>
        {user && !user.isPlus && pathname !== '/plus' ? (
          <div className="col-span-2 row-start-1 -mt-3 w-full lg:mx-0 lg:w-96">
            <div className="block rounded-xl bg-foreground p-4 py-3">
              <h4 className="text-neutral-400">Plus</h4>
              <p className="mb-4 text-base">
                Get full insight in your past and get the most accurate stats
                for your favorite music app today!
              </p>
              <Link
                href="/plus"
                className="mt-2 block w-fit rounded-lg bg-plus p-2 px-3 text-base font-medium text-black"
              >
                Unlock Plus
              </Link>
            </div>
          </div>
        ) : (
          <div className=""></div>
        )}
      </div>

      <br />
      <br />

      {/* <p className="min-w-full text-center text-sm text-neutral-500 md:order-1">
        All copyrighted content (i.e. album artwork) on stats.fm are owned by
        their respective owners. Data is provided by Spotify AB and Apple
        Music®. stats.fm is in no way affiliated with Spotify AB or Apple
        Music®.
      </p> */}
      <p className="min-w-full text-center text-sm text-neutral-500 md:order-1">
        All copyrighted content (i.e. album artwork) on stats.fm are owned by
        their respective owners. Data is provided by Spotify AB. stats.fm is in
        no way affiliated with Spotify AB.
      </p>
      <p className="min-w-full text-center md:mt-0">
        © 2022 StatsFM B.V. (formerly Spotistats for Spotify). All rights
        reserved. Made with ❤️ in the Netherlands.
      </p>
    </Container>
  );
};
