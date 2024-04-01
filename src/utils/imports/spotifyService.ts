/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { z } from 'zod';
import { Platform } from '@/utils/statsfm';
import type { event } from 'nextjs-google-analytics';
import { ZipReader, BlobReader, TextWriter } from '@zip.js/zip.js';
import type { SetStateAction } from 'react';
import {
  type UploadedImportFile,
  type ImportServiceFunction,
  type ToasterType,
  UploadedFilesStatus,
  isJSONParsable,
} from '.';

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

const importValidity = (files: File[], toaster: ToasterType) => {
  if (files.filter((file) => file.type === 'application/zip').length > 1) {
    toaster.error('Only one zip file can be selected.');
    return false;
  }

  if (
    files.filter((file) => file.type === 'application/json').length > 0 &&
    files.filter((file) => file.type === 'application/zip').length > 0
  ) {
    toaster.error("You can't select both a zip file and a JSON file.");
    return false;
  }
  return true;
};

const processJSON = async (
  file: { name: string; content: string },
  utils: {
    event: typeof event;
    setUploadedFiles: (value: SetStateAction<UploadedImportFile[]>) => void;
  },
) => {
  if (
    file.name.match(/StreamingHistory_music_\d\d?.json/g) ||
    file.name.match(/StreamingHistory\d\d?.json/g)
  ) {
    utils.event('IMPORT_SPOTIFY_selected_spotify_account_data');
    utils.setUploadedFiles((oldList) => [
      ...oldList,
      {
        name: file.name,
        addedAt: new Date(),
        uploaded: false,
        status: UploadedFilesStatus.Error,
        error:
          'You are trying to upload the streaming history files from the "Account data" package, we do not support these files.',
        service: Platform.SPOTIFY,
      },
    ]);
  } else {
    const fileText = file.content;
    if (!isJSONParsable(fileText)) {
      utils.event('IMPORT_SPOTIFY_selected_invalid_file');
      utils.setUploadedFiles((oldList) => [
        ...oldList,
        {
          name: file.name,
          addedAt: new Date(),
          uploaded: false,
          status: UploadedFilesStatus.Error,
          error: 'The file you selected is not a valid json file.',
          service: Platform.SPOTIFY,
        },
      ]);
      return;
    }
    const jsonStreams = JSON.parse(fileText);
    let spotifyStreams: SpotifyImportFileSchema;
    try {
      spotifyStreams = await spotifyImportFileSchema.parseAsync(jsonStreams);
    } catch (e: any) {
      utils.event('IMPORT_SPOTIFY_selected_invalid_file');
      utils.setUploadedFiles((oldList) => [
        ...oldList,
        {
          name: file.name,
          addedAt: new Date(),
          uploaded: false,
          status: UploadedFilesStatus.Error,
          error: 'The file you selected does not contain valid data.',
          service: Platform.SPOTIFY,
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
        .map((x) => validSpotifyImportStreamSchema.parseAsync(x)),
    );

    utils.setUploadedFiles((oldList) => [
      ...oldList,
      {
        name: file.name,
        addedAt: new Date(),
        uploaded: false,
        status: UploadedFilesStatus.Ready,
        data: validStreams,
        service: Platform.SPOTIFY,
        contentType: 'application/json',
      },
    ]);
  }
};

export const SpotifyService: ImportServiceFunction = ({
  toaster,
  event,
  setUploadedFiles,
}) => ({
  id: Platform.SPOTIFY,
  name: 'Spotify',
  enabled: true,
  acceptFiles: {
    'application/json': ['.json'],
    'application/zip': ['.zip'],
  },
  handleFileUpload: async (files) => {
    toaster.message('Checking files...');

    if (!importValidity(files, toaster)) return;

    for await (const file of files) {
      if (file.type === 'application/json') {
        const content = await file.text();
        await processJSON(
          { name: file.name, content },
          { event, setUploadedFiles },
        );
      } else if (file.type === 'application/zip') {
        const zipReader = new ZipReader(new BlobReader(file));
        const entries = await zipReader.getEntries();
        const filesToImport: { name: string; content: string }[] = [];
        let accountData = false;
        // eslint-disable-next-line no-restricted-syntax
        for await (const entry of entries) {
          const fileName = entry.filename.split('/').pop()!;
          if (!fileName.includes('.json') || fileName.includes('Video'))
            continue;

          if (
            ['Userdata.json', 'Payments.json', 'Identity.json'].some((x) =>
              fileName.includes(x),
            )
          ) {
            accountData = true;
            break;
          }

          filesToImport.push({
            name: fileName,
            content: await entry.getData!(new TextWriter()),
          });
        }

        if (accountData) {
          toaster.error(
            'It looks like you\'re trying to upload the "Account data" zip file, which is not the same as the "Extended streaming history data" zip file.',
          );
          return;
        }

        if (filesToImport.length === 0) {
          toaster.error(
            'No valid files found in the zip file. Make sure you\'re uploading the "Extended streaming history data" zip file.',
          );
          return;
        }

        Promise.all(
          filesToImport.map((f) => processJSON(f, { event, setUploadedFiles })),
        );
      }
    }
  },
});
