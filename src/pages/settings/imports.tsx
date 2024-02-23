'use client';

/* eslint-disable no-continue */
import { Divider } from '@/components/Divider';
import { ImportList } from '@/components/Import/ImportList';
import { UploadedItem } from '@/components/Import/UploadedItem';
import { Segment, SegmentedControls } from '@/components/SegmentedControls';
import { Title } from '@/components/Title';
import { useApi, useAuth, useToaster } from '@/hooks';
import { useRemoteValue } from '@/hooks/use-remote-config';
import type { UploadedImportFile } from '@/utils/imports';
import { SpotifyImport, UploadedFilesStatus } from '@/utils/imports';
import type { SSRProps } from '@/utils/ssrUtils';
import { fetchUser } from '@/utils/ssrUtils';
import clsx from 'clsx';
import type { GetServerSideProps, NextPage } from 'next';
import { event } from 'nextjs-google-analytics';
import { useState } from 'react';
import type { Accept } from 'react-dropzone';
import Dropzone from 'react-dropzone';
import { MdFileUpload, MdWarning } from 'react-icons/md';
import { BlobReader, TextWriter, ZipReader } from '@zip.js/zip.js';
import { Button } from '@/components/Button';
import { AccountLayout } from '@/components/settings/Layout';

export const getServerSideProps: GetServerSideProps<SSRProps> = async (ctx) => {
  const user = await fetchUser(ctx);

  return {
    props: {
      user,
    },
  };
};

interface ImportService {
  id: string;
  name: string;
  enabled: boolean;
  acceptFiles: Accept;
  handleFileUpload: (file: File[]) => Promise<void> | void;
}

const Imports = () => {
  const { user } = useAuth();
  const api = useApi();
  const toaster = useToaster();

  const [refetchCounter, setRefetchCounter] = useState(new Date());

  const importWarningMessage = useRemoteValue('import_warning_message');
  const importWarning = useRemoteValue('import_warning_visible');
  const importAvailable = useRemoteValue('import_available');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedImportFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const services: ImportService[] = [
    {
      id: 'spotify',
      name: 'Spotify',
      enabled: true,
      acceptFiles: {
        'application/json': ['.json'],
        'application/zip': ['.zip'],
      },
      handleFileUpload: async (files) => {
        toaster.message('Processing files...');
        if (
          files.filter((file) => file.type === 'application/zip').length > 1
        ) {
          toaster.error('Only one zip file can be selected.');
          return;
        }
        if (
          files.filter((file) => file.type === 'application/json').length > 0 &&
          files.filter((file) => file.type === 'application/zip').length > 0
        ) {
          toaster.error("You can't select both a zip file and a JSON file.");
          return;
        }
        // eslint-disable-next-line no-restricted-syntax
        for await (const file of files) {
          if (file.type === 'application/json') {
            const content = await file.text();
            await SpotifyImport.processJSON(
              { name: file.name, content },
              { event, setUploadedFiles }
            );
          } else if (file.type === 'application/zip') {
            const zipReader = new ZipReader(new BlobReader(file));
            const entries = await zipReader.getEntries();
            const filesToImport: { name: string; content: string }[] = [];
            let accountData = false;
            // eslint-disable-next-line no-restricted-syntax
            for await (const entry of entries) {
              const fileName = entry.filename.split('/').pop()!;
              if (!fileName.includes('.json')) continue;
              if (fileName.includes('Video')) continue;

              if (
                ['Userdata.json', 'Payments.json', 'Identity.json'].some((x) =>
                  fileName.includes(x)
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
                'It looks like you\'re trying to upload the "Account data" zip file, which is not the same as the "Extended streaming history data" zip file.'
              );
              return;
            }

            if (filesToImport.length === 0) {
              toaster.error(
                'No valid files found in the zip file. Make sure you\'re uploading the "Extended streaming history data" zip file.'
              );
              return;
            }

            Promise.all(
              filesToImport.map((f) =>
                SpotifyImport.processJSON(f, { event, setUploadedFiles })
              )
            );
          }
        }
      },
    },
    // {
    //   id: 'applemusic',
    //   name: 'Apple Music',
    //   enabled: false,
    //   acceptFiles: {
    //     'text/csv': ['.csv'],
    //   },
    //   handleFileUpload: async () => {},
    // },
  ];

  const uploadFiles = async () => {
    if (isUploading) return;
    setIsUploading(true);

    for (let i = 0; i < uploadedFiles.length; i += 1) {
      const uploadedFile = uploadedFiles[i]!;

      if (uploadedFile.status === UploadedFilesStatus.Ready) {
        uploadedFile.status = UploadedFilesStatus.Pending;
      }
    }

    for (let i = 0; i < uploadedFiles.length; i += 1) {
      const uploadedFile = uploadedFiles[i]!;

      if (uploadedFile!.status !== UploadedFilesStatus.Pending) continue;
      uploadedFile.status = UploadedFilesStatus.Uploading;
      const oldUrl = api.options.http.apiUrl;
      try {
        api.options.http.apiUrl = 'https://import.stats.fm/api';
        // eslint-disable-next-line no-await-in-loop
        await api.me.import({
          name: uploadedFile.name,
          contentType: 'application/json',
          data: JSON.stringify(uploadedFile.data),
          key: 'files',
        });

        event('IMPORT_upload_file');
        uploadedFile.status = UploadedFilesStatus.Uploaded;
      } catch (e: any) {
        uploadedFile.status = UploadedFilesStatus.Failed;
      }

      api.options.http.apiUrl = oldUrl;
    }

    setRefetchCounter(new Date());
    setIsUploading(false);
    setUploadedFiles((oldList) =>
      oldList.filter((x) => x.status !== UploadedFilesStatus.Uploaded)
    );
  };

  const [importService, setImportService] = useState<ImportService>(
    services[0]!
  );

  if (!user) return <></>;

  return (
    <div className="relative w-full">
      <Title>Imports</Title>
      {importWarning?.asBoolean() && (
        <div className="my-8 w-full flex-row rounded-md border-l-4 border-l-yellow-400/80 bg-yellow-400/20 p-4">
          <div className="flex w-full flex-col">
            <span className="flex items-center gap-1">
              <MdWarning className="fill-white" />
              <h4>Warning</h4>
            </span>
            <span className="whitespace-pre-wrap text-white">
              {importWarningMessage?.asString()}
            </span>
          </div>
        </div>
      )}
      <h2>Imports</h2>
      <p>
        Check more about importing your lifetime streaming history{' '}
        <a
          className="text-primary hover:opacity-90"
          href="https://support.stats.fm/docs/import"
          target="blank"
          onClick={() => event('IMPORT_guide_click')}
        >
          in the support documentation.
        </a>
        .
      </p>
      {user.isPlus ? (
        <>
          {importAvailable?.asBoolean() ? (
            <>
              <div className="mt-5 flex flex-col items-center justify-center">
                {services.length > 1 && (
                  <SegmentedControls
                    onChange={(id) => {
                      setImportService(services.find((x) => x.id === id)!);
                    }}
                  >
                    {services.map((service) => (
                      <Segment key={service.id} value={service.id}>
                        {service.name}
                      </Segment>
                    ))}
                  </SegmentedControls>
                )}
                <div className="mt-2 flex w-full items-center justify-center">
                  <Dropzone
                    onDrop={(files) => importService.handleFileUpload(files)}
                    accept={importService.acceptFiles}
                    multiple
                    disabled={!importService.enabled}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <div
                        {...getRootProps({
                          className: clsx(
                            'mt-2 flex h-64 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-700 bg-foreground',
                            importService.enabled
                              ? 'cursor-pointer hover:border-neutral-600 hover:bg-foreground/70'
                              : 'opacity-50'
                          ),
                        })}
                      >
                        {importService.enabled ? (
                          <>
                            <MdFileUpload className="mb-4 h-8 w-8 text-gray-400" />
                            <p className="mb-2 text-sm text-white">
                              <span className="font-semibold text-primary">
                                Click to upload
                              </span>{' '}
                              or drag and drop
                            </p>
                            <p className="text-xs text-gray-400">
                              We accept the following file types:{' '}
                              {Object.values(importService.acceptFiles)
                                .flatMap((x) => x)
                                .join(', ')}{' '}
                              for{' '}
                              {services.length > 1 ? 'this service' : 'Spotify'}
                              .
                            </p>
                            <input {...getInputProps()} />
                          </>
                        ) : (
                          <>
                            <h4 className="mt-2 text-center text-neutral-400">
                              Importing data from {importService.name} is
                              currently not possible.
                            </h4>
                          </>
                        )}
                      </div>
                    )}
                  </Dropzone>
                </div>
              </div>
              {uploadedFiles.length > 0 && (
                <>
                  <Divider className="my-5 border-neutral-600" />
                  <header
                    className={clsx(
                      'z-30 flex items-center justify-between bg-background'
                    )}
                  >
                    <div className="w-full overflow-hidden truncate">
                      <h3>Files waiting to be imported</h3>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Button disabled={isUploading} onClick={uploadFiles}>
                        Upload
                      </Button>
                    </div>
                  </header>
                  <ul role="list" className="divide-y divide-foreground pt-3">
                    {uploadedFiles.map((file, i) => (
                      <UploadedItem
                        {...file}
                        onRemove={(index) => {
                          setUploadedFiles((oldList) => {
                            const newList = [...oldList];
                            newList.splice(index, 1);
                            return newList;
                          });
                        }}
                        index={i}
                        key={i}
                      />
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <h4 className="my-10 text-center text-neutral-400">
              Importing is currently disabled
            </h4>
          )}
          <Divider className="my-5 border-neutral-600" />
          <ImportList
            refetchCounter={refetchCounter}
            triggerRefetch={() => setRefetchCounter(new Date())}
          />
        </>
      ) : (
        <h4 className="my-10 text-white">
          It looks like you don&apos;t have stats.fm Plus. In order to import,
          you need stats.fm Plus.
        </h4>
      )}
    </div>
  );
};

const ImportPage: NextPage = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <AccountLayout>
      <Imports />
    </AccountLayout>
  );
};

export default ImportPage;
