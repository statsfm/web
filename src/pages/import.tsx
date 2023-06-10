import { Container } from '@/components/Container';
import { Divider } from '@/components/Divider';
import { Title } from '@/components/Title';
import { useApi, useAuth, useToaster } from '@/hooks';
import { useRemoteValue } from '@/hooks/use-remote-config';
import type { UserImport } from '@statsfm/statsfm.js';
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import { event } from 'nextjs-google-analytics';
import type { ChangeEvent, FC } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { MdWarning } from 'react-icons/md';

const ImportList: FC<{ refetchCounter: number }> = ({ refetchCounter }) => {
  const api = useApi();
  const [imports, setImports] = useState<UserImport[] | null>(null);

  useEffect(() => {
    (async () => {
      setImports(await api.me.imports());
    })();
  }, [refetchCounter]);

  const getStatus = useCallback((status: number) => {
    return {
      '-1': 'Errored!',
      '0': 'Queued (waiting to be processed)',
      '1': 'Processing',
      '2': 'Successfully processed',
    }[status.toString()];
  }, []);

  if (!imports || imports.length === 0) {
    return (
      <h4 className="my-5 text-neutral-400">
        It looks like you don&apos;t have any imports yet!
      </h4>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {imports &&
        imports.map((imported) => (
          <li
            key={imported.name}
            className="relative flex items-center justify-between overflow-hidden py-2"
          >
            <div className="w-full text-neutral-400">
              <h4 className="text-white"> {imported.name}</h4>
              <span>
                Imported on{' '}
                {dayjs(imported.createdAt).format('DD/M/YYYY hh:mm')}
              </span>
              <br />
              <span>{imported.count} streams</span>
              <br />
              <span>{getStatus(imported.status)}</span>
            </div>
          </li>
        ))}
    </ul>
  );
};

type Props = {};

const ImportPage: NextPage<Props> = () => {
  const { user } = useAuth();
  const api = useApi();
  const toaster = useToaster();

  const [refetchCounter, setRefetchCounter] = useState(0);

  const importWarningMessage = useRemoteValue('import_warning_message');
  const importWarning = useRemoteValue('import_warning_visible');
  const importAvailable = useRemoteValue('import_available');

  if (!user) return <></>;

  // TODO: this function is a direct port of the vue one, it can do with some improvments and refactoring
  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (!files || files.length === 0) {
      toaster.error('No files selected');
      return;
    }

    if (files.length > 1) {
      toaster.error('You can only upload one file at a time');
      return;
    }

    const file = files.item(0)!;

    if (file && file.name.match(/StreamingHistory[0-9][0-9]?.json/g)) {
      event('IMPORT_selected_wrong_files');
      window.location.href =
        'https://support.stats.fm/docs/import/faq/no-endsong';
    } else if (file && file.name.match(/\.json/i)) {
      // THESE 2 LINES SHOULD NEVER BE JOINED INTO 1, FOR SOME FUCKING REASON IT BREAKS NEXT
      const z = await file.text();
      let streams = JSON.parse(z);

      const validStreams = streams
        .map((e: any) => {
          return {
            ts: e?.ts ?? undefined,
            ms: e?.ms_played ?? undefined,
            tn: e?.master_metadata_track_name ?? undefined,
            ti: e?.spotify_track_uri?.split(':')[2] ?? undefined,
          };
        })
        .filter((x: any) => x.ts && x.ms && x.tn && x.ti);
      streams = null;

      const a = JSON.stringify(validStreams);
      const formData = new FormData();
      const blob = new Blob([a], { type: 'application/json' });
      const newFile = new File([blob], file.name);
      formData.append('files', newFile);

      const oldUrl = api.http.config.baseUrl;
      try {
        api.http.config.baseUrl = 'https://import.stats.fm/api/v1';
        await api.me.import({
          headers: {
            'Content-Type': null!,
          },
          body: formData,
        });

        event('IMPORT_upload_files');
        toaster.message(`succesfully uploaded.. ${file.name}`);
        setRefetchCounter((c) => c + 1);
      } catch (e) {
        // @ts-expect-error
        toaster.error(JSON.stringify(e?.data ?? e).toString());
      }
      api.http.config.baseUrl = oldUrl;
    } else {
      toaster.error(
        'Something must have gone wrong here, are you sure you are uploading the right file?'
      );
    }
  };

  return (
    <Container className="pt-20">
      <Title>Import</Title>
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
          here in the support docs
        </a>
        . Scroll down to import a new file.
      </p>
      {user.isPlus ? (
        <>
          <ImportList refetchCounter={refetchCounter} />
          <Divider className="my-5 border-neutral-600" />
          {importAvailable?.asBoolean() ? (
            <label
              onClick={() => event('IMPORT_select_files')}
              className="mt-2 block w-full cursor-pointer rounded-2xl border-0 bg-primary/10 py-3 px-5 text-center font-bold text-primary transition-colors duration-300 hover:bg-primary/20 active:bg-primary/5"
            >
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={onFileChange}
              />
              Import a new file (the .json files, not the zip file)
            </label>
          ) : (
            <h4 className="my-10 text-center text-neutral-400">
              Importing is currently disabled
            </h4>
          )}
        </>
      ) : (
        <h4 className="my-10 text-white">
          It looks like you don&apos;t have stats.fm Plus. In order to import
          you need stats.fm Plus to cover all the extra server costs (from
          storing all the streams etc)
        </h4>
      )}
    </Container>
  );
};

export default ImportPage;
