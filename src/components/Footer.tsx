import Link from 'next/link';
import { Container } from './Container';
import { Logo } from './Logo';

const links: { label: string; links: { label: string; href: string }[] }[] = [
  {
    label: 'Stats.fm',
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
    ],
  },
  {
    label: 'Socials',
    links: [
      {
        label: 'Discord',
        href: 'https://discord.gg/spotistats',
      },
      {
        label: 'Twitter',
        href: 'https://twitter.com/spotistats',
      },
      {
        label: 'Instagram',
        href: 'https://instagram.com/spotistats',
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
  return (
    <Container as="footer" className="py-14">
      <div className="grid grid-cols-4 place-items-start gap-x-4">
        <div>
          <Logo />
          <p className="mt-10 min-w-full pt-5 md:order-1 md:mt-0">
            All rights reserved. Made with ❤️ in the Netherlands.
          </p>
        </div>

        {links.map((cat, i) => (
          <div key={i} className="grid place-items-start">
            <h4 className="mb-2 text-text-grey">{cat.label}</h4>
            <ul className="grid gap-2">
              {/* eslint-disable-next-line @typescript-eslint/no-shadow */}
              {cat.links.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-[1rem]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-10 min-w-full pt-10 text-center text-neutral-500 md:order-1 md:mt-0">
        All copyrighted content (i.e. album artwork) on Stats.fm are owned by
        their respective owners. Data is provided by Spotify. Spotify is a
        trademark of Spotify AB. Stats.fm is in no way affiliated with Spotify.
        Spotify is a trademark of Spotify AB. Stats.fm is not affiliated with
        Spotify.
      </p>
      <p className="text-center text-text-grey">
        © 2022 Stats.fm / Spotistats for Spotify.
      </p>
    </Container>
  );
};
