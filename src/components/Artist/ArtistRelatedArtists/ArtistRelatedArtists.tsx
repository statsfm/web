import { useState, type FC, useEffect } from 'react';
import { type Artist } from '@/utils/statsfm';
import { useApi } from '@/hooks';
import { event } from 'nextjs-google-analytics';
import {
  Section,
  SectionToolbarCarouselNavigation,
} from '@/components/Section';
import {
  RelatedArtistCard,
  RelatedArtistCardSkeleton,
} from '@/components/Artist/RelatedArtistCard';
import { Carousel } from '@/components/Carousel';

type Props = {
  artist: Artist;
};

export const ArtistRelatedArtists: FC<Props> = ({ artist }) => {
  const [related, setRelated] = useState<Artist[]>([]);

  const [loading, setLoading] = useState(true);
  const api = useApi();

  useEffect(() => {
    (async () => {
      setLoading(true);
      setRelated(
        await api.artists.related(artist.id).then((r) => r.filter((a) => a.id)),
      );
      setLoading(false);
    })();
  }, [artist.id]);

  return (
    <Carousel slide={1} rows={3}>
      <Section
        title="Related artists"
        description="Artists that fans might also like"
        toolbar={
          <div className="flex gap-1">
            <SectionToolbarCarouselNavigation
              callback={() => event('ARTIST_related_artist_previous')}
            />
            <SectionToolbarCarouselNavigation
              next
              callback={() => event('ARTIST_related_artist_next')}
            />
          </div>
        }
      >
        <Carousel.Items>
          {!loading && related.length > 0
            ? related.map((item) => (
                <Carousel.Item
                  key={(Math.random() + 1).toString(36).substring(7)}
                  onClick={() => event('ARTIST_related_artist_click')}
                >
                  <RelatedArtistCard {...item} />
                </Carousel.Item>
              ))
            : Array(20)
                .fill(null)
                .map(() => (
                  <Carousel.Item
                    key={(Math.random() + 1).toString(36).substring(7)}
                  >
                    <RelatedArtistCardSkeleton />
                  </Carousel.Item>
                ))}
        </Carousel.Items>
      </Section>
    </Carousel>
  );
};
