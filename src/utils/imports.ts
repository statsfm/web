import { z } from 'zod';
import type { event } from 'nextjs-google-analytics';
import type { SetStateAction } from 'react';

export const IMPORT_STATUS = {
  '-1': 'Errored!',
  '0': 'Queued (waiting to be processed)',
  '1': 'Processing',
  '2': 'Successfully processed',
} as const;

export enum UploadedFilesStatus {
  Error = -1,
  Ready = 0,
  Pending = 1,
  Uploading = 2,
  Uploaded = 3,
  Failed = 4,
}

export const UPLOADED_FILE_STATUS = {
  [UploadedFilesStatus.Error]: 'Error',
  [UploadedFilesStatus.Ready]: 'Ready to upload',
  [UploadedFilesStatus.Pending]: 'Pending',
  [UploadedFilesStatus.Uploading]: 'Uploading...',
  [UploadedFilesStatus.Uploaded]: 'Uploaded successfully',
  [UploadedFilesStatus.Failed]:
    'Failed to upload (Server issue, try again later)',
} as const;

export const IMPORT_STATUS_COLORS = {
  '2': 'text-green-400 ring-green-400/30',
  '1': 'text-gray-400 ring-gray-400/30',
  '0': 'text-yellow-400 ring-yellow-400/30',
  '-1': 'text-red-400 ring-red-400/30',
} as const;

export const UPLOADED_FILE_STATUS_COLORS = {
  [UploadedFilesStatus.Error]: 'text-red-400 ring-red-400/30',
  [UploadedFilesStatus.Ready]: 'text-gray-400 ring-gray-400/30',
  [UploadedFilesStatus.Pending]: 'text-yellow-400 ring-yellow-400/30',
  [UploadedFilesStatus.Uploading]: 'text-orange-400 ring-orange-400/30',
  [UploadedFilesStatus.Uploaded]: 'text-green-400 ring-green-400/30',
  [UploadedFilesStatus.Failed]: 'text-red-400 ring-red-400/30',
} as const;

export function getOrdinal(n: number) {
  let ord = 'th';

  if (n % 10 === 1 && n % 100 !== 11) {
    ord = 'st';
  } else if (n % 10 === 2 && n % 100 !== 12) {
    ord = 'nd';
  } else if (n % 10 === 3 && n % 100 !== 13) {
    ord = 'rd';
  }

  return ord;
}

export const MONTHS = [
  'January',
  'Febuary',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export function getMonthName(month: number) {
  return MONTHS[month];
}

export const spotifyStreamInfo = z.object({
  ts: z.string(),
  ms_played: z.number(),
  master_metadata_track_name: z.string().nullable(),
  spotify_track_uri: z.string().nullable(),
});

export type SpotifyStreamInfo = z.infer<typeof spotifyStreamInfo>;

export const spotifyImportFileSchema = z.array(spotifyStreamInfo);

export type SpotifyImportFileSchema = z.infer<typeof spotifyImportFileSchema>;

export const validSpotifyImportStreamSchema = z.object({
  ts: z.string(),
  ms: z.number(),
  tn: z.string(),
  ti: z.string(),
});

export type ValidSpotifyStream = z.infer<typeof validSpotifyImportStreamSchema>;

export function isJSONParsable(input: string) {
  try {
    JSON.parse(input);
    return true;
  } catch (error) {
    return false;
  }
}

export type UploadedImportFile<T extends any[] = any[]> = {
  name: string;
  addedAt: Date;
  status: UploadedFilesStatus;
} & (
  | { status: UploadedFilesStatus.Error; error: string }
  | {
      status: Exclude<UploadedFilesStatus, UploadedFilesStatus.Error>;
      data: T;
    }
);

export const SpotifyImport = {
  processJSON: async (
    file: { name: string; content: string },
    utils: {
      event: typeof event;
      setUploadedFiles: (value: SetStateAction<UploadedImportFile[]>) => void;
    }
  ) => {
    if (
      file.name.match(/StreamingHistory_music_[0-9][0-9]?.json/g) ||
      file.name.match(/StreamingHistory[0-9][0-9]?.json/g)
    ) {
      utils.event('IMPORT_selected_spotify_account_data');
      utils.setUploadedFiles((oldList) => [
        ...oldList,
        {
          name: file.name,
          addedAt: new Date(),
          uploaded: false,
          status: UploadedFilesStatus.Error,
          error:
            'You are trying to upload the streaming history files from the "Account data" package, we do not support these files.',
        },
      ]);
    } else {
      const fileText = file.content;
      if (!isJSONParsable(fileText)) {
        utils.event('IMPORT_selected_invalid_file');
        utils.setUploadedFiles((oldList) => [
          ...oldList,
          {
            name: file.name,
            addedAt: new Date(),
            uploaded: false,
            status: UploadedFilesStatus.Error,
            error: 'The file you selected is not a valid json file.',
          },
        ]);
        return;
      }
      const jsonStreams = JSON.parse(fileText);
      let spotifyStreams: SpotifyImportFileSchema;
      try {
        spotifyStreams = await spotifyImportFileSchema.parseAsync(jsonStreams);
      } catch (e: any) {
        utils.event('IMPORT_selected_invalid_file');
        utils.setUploadedFiles((oldList) => [
          ...oldList,
          {
            name: file.name,
            addedAt: new Date(),
            uploaded: false,
            status: UploadedFilesStatus.Error,
            error: 'The file you selected does not contain valid data.',
          },
        ]);
        return;
      }
      // filter out invalid streams
      const validStreams = await Promise.all(
        spotifyStreams
          .map((e) => {
            return {
              ts: e?.ts ?? undefined,
              ms: e?.ms_played ?? undefined,
              tn: e?.master_metadata_track_name ?? undefined,
              ti: e?.spotify_track_uri?.split(':')[2] ?? undefined,
            };
          })
          .filter((x) => x.ts && x.ms && x.tn && x.ti)
          .map((x) => validSpotifyImportStreamSchema.parseAsync(x))
      );

      utils.setUploadedFiles((oldList) => [
        ...oldList,
        {
          name: file.name,
          addedAt: new Date(),
          uploaded: false,
          status: UploadedFilesStatus.Ready,
          data: validStreams,
        },
      ]);
    }
  },
};
