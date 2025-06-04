import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { Image } from '@/components/Image';
import { Textarea } from '@/components/Textarea';
import { Title } from '@/components/Title';
import { DEFAULT_USER_IMAGE_URL } from '@/constants';
import { useApi, useToaster } from '@/hooks';
import dayjs from '@/utils/dayjs';
import formatter from '@/utils/formatter';
import { getApiInstance, type SSRProps } from '@/utils/ssrUtils';
import { Listbox, Transition } from '@headlessui/react';
import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Fragment, useState } from 'react';
import { MdArrowDropDown, MdCheck } from 'react-icons/md';

const ReportingType = {
  artist: 'ARTIST',
  album: 'ALBUM',
  track: 'TRACK',
} as const;

type ReportingTypeKey = keyof typeof ReportingType;

type Props = SSRProps & {
  type: ReportingTypeKey;
  id: number;
  name: string;
  followers?: number; // only for artists
  totalTracks?: number; // only for albums
  releaseDate?: string; // only for albums
  durationMs?: number; // only for tracks
  artists?: {
    name: string;
    id: number;
  }[];
  imageUrl?: string;
  albumId?: number; // only for albums
  primaryAlbum?: {
    // only for tracks
    id: number;
    name: string;
  };
};

const whatNotToReport = {
  artist: [
    'Artist genres (these are provided by the artists label)',
    'Artist follower count (this is currently only updated every 6 months)',
  ],
  album: ['Audio analysis inaccuraties (this data comes from Spotify)'],
  track: [
    'Track popularity (this is being fixed soon for all tracks)',
    'Audio analysis inaccuraties (this data comes from Spotify)',
  ],
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const api = getApiInstance();
  const reportType = ctx.params?.type?.toString();
  const id = ctx.params?.id?.toString();

  if (!reportType || !id) {
    throw new Error('no param type or id recieved');
  }

  // error if id not a number
  if (Number.isNaN(parseInt(id, 10))) {
    throw new Error('id must be a number');
  }

  const props: Partial<Props> = {};

  props.type = reportType as Props['type'];
  props.id = parseInt(id, 10);

  if (props.type === 'artist') {
    const artist = await api.artists.get(props.id);
    props.name = artist.name;
    props.imageUrl = artist.image;
    props.followers = artist.followers;
  } else if (props.type === 'album') {
    const album = await api.albums.get(props.id);
    props.name = album.name;
    props.imageUrl = album.image;
    props.totalTracks = album.totalTracks;
    props.releaseDate = new Date(album.releaseDate).toISOString();
    props.artists = album.artists.map((artist) => ({
      name: artist.name,
      id: artist.id,
    }));
    props.albumId = album.id;
  } else if (props.type === 'track') {
    const track = await api.tracks.get(props.id);
    const trackPrimaryAlbum = track.albums[0];
    if (!trackPrimaryAlbum) {
      throw new Error('no primary album found for track');
    }
    props.name = track.name;
    props.imageUrl = trackPrimaryAlbum.image;
    props.artists = track.artists.map((artist) => ({
      name: artist.name,
      id: artist.id,
    }));
    props.primaryAlbum = {
      id: trackPrimaryAlbum.id,
      name: trackPrimaryAlbum.name,
    };
    props.durationMs = track.durationMs;
  } else {
    return { notFound: true };
  }

  return {
    props: props as Props,
  };
};

const ReportingReasonTypes = {
  PLACEHOLDER: 'PLACEHOLDER',
  MISSING_ARTWORK: 'MISSING_ARTWORK',
  WRONGLY_MERGED: 'WRONGLY_MERGED',
  INCOMPLETE: 'INCOMPLETE',
  DUPLICATE: 'DUPLICATE',
  OTHER: 'OTHER',
} as const;

const ReportingReasons = {
  [ReportingReasonTypes.PLACEHOLDER]: 'Choose reason',
  [ReportingReasonTypes.MISSING_ARTWORK]: 'Missing/incorrect image',
  [ReportingReasonTypes.WRONGLY_MERGED]: 'Wrongly merged',
  [ReportingReasonTypes.INCOMPLETE]: 'Incomplete',
  [ReportingReasonTypes.DUPLICATE]: 'Duplicate',
  [ReportingReasonTypes.OTHER]: 'Other',
} as const;

const Descriptions = {
  [ReportingReasonTypes.MISSING_ARTWORK]: (type: Props['type']) =>
    `Do you think this ${type} should have an image, or is the current image incorrect? Please provide us with as much details as you can so we can investigate further.`,
  [ReportingReasonTypes.WRONGLY_MERGED]: (type: Props['type']) =>
    `Let us know which ${type}s got incorrectly merged into one (please provide both Spotify and/or Apple Music links to the ${type}s). Please provide us with as much details as you can so we can investigate further.`,
  [ReportingReasonTypes.INCOMPLETE]: (type: Props['type']) =>
    `Please tell us if there is anything missing or wrong with this ${type}. Please provide us with as much details as you can so we can investigate further.`,
  [ReportingReasonTypes.DUPLICATE]: (type: Props['type']) =>
    `Please provide a reason why you think the ${type}s need to be merged into one. Please provide us with as much details as you can so we can investigate further.`,
  [ReportingReasonTypes.OTHER]: (_type: Props['type']) =>
    "If you don't see the reason you're looking for, please inform us about any incorrect metadata you've noticed. Please provide us with as much details as you can so we can investigate further.",
};

const Reporting: NextPage<Props> = (props) => {
  const api = useApi();
  const router = useRouter();
  const toaster = useToaster();
  const [reportReason, setReportReason] = useState<
    keyof typeof ReportingReasonTypes
  >(ReportingReasonTypes.PLACEHOLDER);
  const [reportText, setReportText] = useState('');
  const [availableReasons, setAvailableReasons] = useState<
    (keyof typeof ReportingReasonTypes)[]
  >(Object.keys(ReportingReasonTypes) as any);

  const handleReasonSelect = (reason: keyof typeof ReportingReasonTypes) => {
    if (availableReasons.includes('PLACEHOLDER')) {
      setAvailableReasons(
        availableReasons.filter((reason) => reason !== 'PLACEHOLDER'),
      );
    }
    setReportReason(reason);
  };

  return (
    <>
      <Title>Report issues with {props.name}</Title>
      <div className="bg-foreground pt-20">
        <Container className="pb-10 pt-24">
          <h2 className="text-2xl">
            You are reporting an issue with a{props.type !== 'track' && 'n'}{' '}
            {props.type}:
          </h2>
          <section className="flex flex-col items-center gap-5 pt-3 md:flex-row">
            {props.type === 'artist' ? (
              <Avatar src={props.imageUrl} name={props.name} size="4xl" />
            ) : (
              <Image
                src={props.imageUrl ?? DEFAULT_USER_IMAGE_URL}
                alt={props.name}
                width={192}
                height={192}
              />
            )}
            <div className="flex flex-col justify-end">
              {(props.type === 'track' || props.type === 'album') && (
                <p>
                  <span className="text-white">Artists:</span>{' '}
                  {props.artists!.map((artist) => (
                    <span key={artist.id}>
                      {artist.name} (ID: {artist.id})
                    </span>
                  ))}
                </p>
              )}
              <h1 className="text-center font-extrabold md:text-left">
                {props.name} (ID: {props.id})
              </h1>
              {props.type === 'artist' && (
                <span className="text-center text-lg md:text-left">
                  {formatter.localiseNumber(props.followers!)} followers
                </span>
              )}
              {props.type === 'album' && (
                <p>
                  <span className="text-white">{props.totalTracks}</span>{' '}
                  tracks, released on{' '}
                  <span className="text-white">
                    {new Date(props.releaseDate!).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </p>
              )}
              {props.type === 'track' && (
                <>
                  <p>
                    <span className="text-white">Track duration:</span>{' '}
                    {dayjs
                      .duration(props.durationMs ?? 0, 'milliseconds')
                      .format('m:ss')}
                  </p>
                  <p>
                    <span className="text-white">Primary album:</span>{' '}
                    {props.primaryAlbum!.name} (ID: {props.primaryAlbum!.id})
                  </p>
                </>
              )}
            </div>
          </section>
        </Container>
      </div>
      <Container className="mt-8">
        {/* What not to report */}
        <section className="mb-8">
          <h2 className="text-2xl">What not to report</h2>
          <ul>
            {whatNotToReport[props.type].map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </section>
        {/* Reporting form */}
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="reason" className="block font-medium text-white">
              Reason
            </label>
            <div className="mt-2">
              <Listbox value={reportReason} onChange={handleReasonSelect}>
                <div className="relative mt-1 w-72">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-foreground py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-primary sm:text-sm">
                    <span className="block truncate">
                      {ReportingReasons[reportReason]}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <MdArrowDropDown
                        className="size-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-foreground py-1 text-sm shadow-lg ring-1 ring-black/5 focus:outline-none">
                      {availableReasons.map((reason) => (
                        <Listbox.Option
                          key={reason}
                          value={reason}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? 'bg-background/50' : 'text-gray-900'
                            }`
                          }
                        >
                          {({ selected }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected && 'text-white'
                                }`}
                              >
                                {ReportingReasons[reason]}
                              </span>
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                                  <MdCheck
                                    className="size-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
          {reportReason !== ReportingReasonTypes.PLACEHOLDER && (
            <div className="col-span-full">
              <label htmlFor="about" className="block font-medium text-white">
                Details
              </label>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                {Descriptions[reportReason]!(props.type)}
              </p>
              <div className="mt-2">
                <Textarea
                  id="about"
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  minLength={40}
                />
              </div>
            </div>
          )}
          <div className="sm:col-span-4">
            <Button
              disabled={
                reportReason === ReportingReasonTypes.PLACEHOLDER ||
                reportText.length < 40
              }
              onClick={async () => {
                const response = await api.http
                  .post<any>('/reports/catalog', {
                    authRequired: true,
                    body: JSON.stringify({
                      type: ReportingType[props.type],
                      typeId: props.id,
                      reason: reportReason,
                      description: reportText,
                    }),
                  })
                  .catch((e) => {
                    if (e.message === 'You have already reported this item.') {
                      toaster.error('You have already reported this item.');
                    }
                  });
                if (response) {
                  toaster.message('Report sent!');
                  await new Promise((resolve) => {
                    setTimeout(resolve, 2000);
                  });
                  router.push(`/${props.type}/${props.id}`);
                }
              }}
            >
              Report
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Reporting;
