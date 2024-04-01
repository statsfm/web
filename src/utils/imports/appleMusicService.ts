/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { Platform } from '@/utils/statsfm';
import type { Entry } from '@zip.js/zip.js';
import { ZipReader, BlobReader, BlobWriter, TextWriter } from '@zip.js/zip.js';
import type { ImportServiceFunction, ToasterType } from '.';
import { UploadedFilesStatus } from '.';

const importValidity = (files: File[], toaster: ToasterType) => {
  if (files.filter((file) => file.type === 'application/zip').length > 1) {
    toaster.error('Only one zip file can be selected.');
    return false;
  }

  if (
    files.filter((file) => file.type === 'text/csv').length > 0 &&
    files.filter((file) => file.type === 'application/zip').length > 0
  ) {
    toaster.error("You can't select both a zip file and a CSV file.");
    return false;
  }
  return true;
};

const fileNamesToImport = ['Apple Music - Play History Daily Tracks.csv'];
const appleMediaSerivcesFileName = /Apple[\s_]Media[\s_]Services\.zip/g;

export const AppleMusicService: ImportServiceFunction = ({
  toaster,
  setUploadedFiles,
}) => ({
  id: Platform.APPLEMUSIC,
  name: 'Apple Music',
  enabled: true,
  acceptFiles: {
    'text/csv': ['.csv'],
    'application/zip': ['.zip'],
  },
  handleFileUpload: async (files) => {
    toaster.message('Checking files...');

    if (!importValidity(files, toaster)) return;

    for await (const file of files) {
      if (file.type === 'text/csv') {
        toaster.message('Processing CSV file');
        const content = await file.text();
        setUploadedFiles((oldList) => [
          ...oldList,
          {
            name: file.name,
            addedAt: new Date(),
            contentType: file.type,
            status: UploadedFilesStatus.Ready,
            data: content,
            service: Platform.APPLEMUSIC,
          },
        ]);
      } else if (file.type === 'application/zip') {
        toaster.message('Processing ZIP file');
        const zipReader = new ZipReader(new BlobReader(file));
        const entries = await zipReader.getEntries();

        const filterAndUploadFiles = async (entries: Entry[]) => {
          const filteredEntries = entries.filter((entry) =>
            fileNamesToImport.some((name) => entry.filename.includes(name)),
          );
          for await (const entry of filteredEntries) {
            const fileContent = await entry.getData!(new TextWriter());
            setUploadedFiles((oldList) => [
              ...oldList,
              {
                name: entry.filename.split('/').pop()!,
                addedAt: new Date(),
                contentType: 'text/csv',
                status: UploadedFilesStatus.Ready,
                data: fileContent,
                service: Platform.APPLEMUSIC,
              },
            ]);
          }
        };

        const hasAppleMediaServicesFile = entries.some((entry) =>
          entry.filename.match(appleMediaSerivcesFileName),
        );

        if (hasAppleMediaServicesFile) {
          const appleMediaZipFile = entries.find((entry) =>
            entry.filename.match(appleMediaSerivcesFileName),
          )!;
          const appleMediaZipContent = await appleMediaZipFile.getData!(
            new BlobWriter(),
          );
          const appleMediaZipReader = new ZipReader(
            new BlobReader(appleMediaZipContent),
          );
          const appleMediaEntries = await appleMediaZipReader.getEntries();
          await filterAndUploadFiles(appleMediaEntries);
        } else {
          await filterAndUploadFiles(entries);
        }
      }
    }
  },
});
