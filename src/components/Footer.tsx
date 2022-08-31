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
              src="https://cdn.stats.fm/file/statsfm/images/brands/stores/app_store.webp"
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
              src="https://cdn.stats.fm/file/statsfm/images/brands/stores/play_store.webp"
              alt="Google Play"
              className="h-9"
            />
          </a>
        </div>
      </div>

      <br />
      <br />

      {/* <p className="min-w-full text-center text-sm text-neutral-500 md:order-1">
        All copyrighted content (i.e. album artwork) on Stats.fm are owned by
        their respective owners. Data is provided by Spotify AB and Apple
        Music®. Stats.fm is in no way affiliated with Spotify AB or Apple
        Music®.
      </p> */}
      <p className="min-w-full text-center text-sm text-neutral-500 md:order-1">
        All copyrighted content (i.e. album artwork) on Stats.fm are owned by
        their respective owners. Data is provided by Spotify AB. Stats.fm is in
        no way affiliated with Spotify AB.
      </p>
      <p className="min-w-full text-center md:mt-0">
        © 2022 StatsFM B.V. (formerly Spotistats for Spotify). All rights
        reserved. Made with ❤️ in the Netherlands.
      </p>
    </Container>
  );
};
