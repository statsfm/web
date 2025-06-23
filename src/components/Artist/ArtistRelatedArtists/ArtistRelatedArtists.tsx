import { useState, type FC, useEffect } from 'react';
import { type Artist } from '@/utils/statsfm';
import { useApi } from '@/hooks';
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
      try {
        const result = await api.artists.related(artist.id);
        setRelated(result.filter((a) => !!a.id));
      } catch {
        setRelated([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [artist.id]);

  return (
    <Carousel slide={1} rows={3}>
      <Section
        title="Related artists"
        description="Artists that fans might also like"
        toolbar={
          <div className="flex gap-1">
            <SectionToolbarCarouselNavigation />
            <SectionToolbarCarouselNavigation next />
          </div>
        }
      >
        <Carousel.Items>
          {!loading && related.length > 0
            ? related.map((item) => (
                <Carousel.Item
                  key={(Math.random() + 1).toString(36).substring(7)}
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
