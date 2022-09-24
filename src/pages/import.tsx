import { Container } from '@/components/Container';
import { Divider } from '@/components/Divider';
import { Title } from '@/components/Title';
import { useApi, useAuth, useToaster } from '@/hooks';
import type { UserImport } from '@statsfm/statsfm.js';
import dayjs from 'dayjs';
import type { NextPage } from 'next';
import type { ChangeEvent, FC } from 'react';
import { useCallback, useEffect, useState } from 'react';

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

    if (file && file.name.match(/^endsong(?:_[0-9]+)?\.json/i)) {
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

        toaster.message(`succesfully uploaded.. ${file.name}`);
        setRefetchCounter((c) => c + 1);
      } catch (e) {
        // @ts-expect-error
        toaster(JSON.stringify(e?.data ?? e).toString());
      }
      api.http.config.baseUrl = oldUrl;
    } else if (file?.name.match(/StreamingHistory[0-9][0-9]?.json/g)) {
      window.location.href =
        'https://support.stats.fm/docs/import/faq/no-endsong';
    } else {
      toaster.error(
        'You just need to upload the "endsong_X.json" files, not the ap_endsong or any other files :)'
      );
    }
  };

  if (!user) return <>Unauthorized</>;

  return (
    <Container className="pt-20">
      <Title>Import</Title>
      <h2>Imports</h2>
      <p>
        Check more about importing your lifetime streaming history{' '}
        <a
          className="text-primary hover:opacity-90"
          href="https://support.stats.fm/docs/import"
          target="blank"
        >
          here in the support docs
        </a>
        . Scroll down to import a new file.
      </p>
      {user.isPlus ? (
        <>
          <ImportList refetchCounter={refetchCounter} />
          <Divider className="my-5 border-neutral-600" />
          <label className="mt-2 block w-full cursor-pointer rounded-2xl border-0 bg-primary/10 py-3 px-5 text-center font-bold text-primary transition-colors duration-300 hover:bg-primary/20 active:bg-primary/5">
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={onFileChange}
            />
            Import a new file (only the endsong.json files)
          </label>
        </>
      ) : (
        <h4 className="my-10 text-white">
          It looks like you don&apos;t have Spotistats Plus. In order to import
          you need Spotistats Plus to cover all the extra server costs (from
          storing all the streams etc)
        </h4>
      )}
    </Container>
  );
};

export default ImportPage;
