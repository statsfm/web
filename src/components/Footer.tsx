import Link from 'next/link';
import { Container } from './Container';

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
      <div className="grid grid-flow-row place-items-start gap-4 md:grid-flow-col">
        {links.map((cat, i) => (
          <div key={i} className="grid place-items-start">
            <h4 className="mb-2 text-text-grey">{cat.label}</h4>
            <ul className="grid gap-2">
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

        <div>
          <h4 className="text-neutral-400">Download</h4>
          <div className="mt-4"></div>
          <a
            className="h-9"
            href="https://apps.apple.com/app/spotistats-for-spotify/id1526912392"
            target="blank"
          >
            <img
              src="../../assets/apple_appstore_badge.png"
              alt="Apple Appstore"
              className="h-9"
            />
          </a>
          <div className="mt-2"></div>
          <a
            className="h-9"
            href="https://play.google.com/store/apps/details?id=dev.netlob.spotistats"
            target="blank"
          >
            <img
              src="../../assets/google_play_badge.png"
              alt="Google Play"
              className="h-9"
            />
          </a>
        </div>
      </div>

      <p className="mt-10 min-w-full pt-10 text-center md:order-1 md:mt-0">
        All copyrighted content (i.e. album artwork) on Stats.fm are owned by
        their respective owners. Data is provided by Spotify. Spotify is a
        trademark of Spotify AB. Stats.fm is in no way affiliated with Spotify.
        <br />© 2022 Stats.fm / Spotistats for Spotify. All rights reserved.
        Made with ❤️ in the Netherlands.
      </p>
    </Container>
  );
};
