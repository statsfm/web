import { Container } from '@/components/Container';
import { Divider } from '@/components/Divider';
import { Title } from '@/components/Title';
import { useApi, useAuth, useToaster } from '@/hooks';
import { useRemoteValue } from '@/hooks/use-remote-config';
import type { NextPage } from 'next';
import { event } from 'nextjs-google-analytics';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { MdWarning } from 'react-icons/md';
import { ProgressBar } from '@/components/ProgressBar/ProgressBar';
import { ImportGroupedList } from '@/components/Import/ImportGroupedList';

type Props = {};

const ImportPage: NextPage<Props> = () => {
  const { user } = useAuth();
  const api = useApi();
  const toaster = useToaster();

  const [refetchCounter, setRefetchCounter] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState({
    progress: 0,
    description: 'Uploading',
  });

  const importWarningMessage = useRemoteValue('import_warning_message');
  const importWarning = useRemoteValue('import_warning_visible');
  const importAvailable = useRemoteValue('import_available');

  if (!user) return <></>;

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

    if (
      file &&
      file.name.match(
        /(?:Play|play|History|history).*(?:Activity|activity|Daily|daily)*.\.csv/i
      )
    ) {
      // THESE 2 LINES SHOULD NEVER BE JOINED INTO 1, FOR SOME FUCKING REASON IT BREAKS NEXT
      const z = (await file.text()).split('\n');
      const head = z[0];
      let idx = 0;
      const oldUrl = api.http.config.baseUrl;
      const totalChunks = Math.round(z.length / 3000);
      const progressSize = 100 / totalChunks;
      if (totalChunks > 1)
        setLoadingProgress({
          progress: 0,
          description: 'Splitting file on chunks',
        });
      while (z.length) {
        const progressPercent = Math.round((idx > 0 ? idx : 1) * progressSize);
        if (totalChunks <= 1)
          setLoadingProgress({ progress: 53, description: 'Uploading' });
        else
          setLoadingProgress({
            progress: progressPercent,
            description: `Splitting file on chunks and uploading.`,
          });
        const csvData = totalChunks > 1 ? z.splice(0, 3000) : z.splice(0);
        if (idx > 0) csvData.unshift(head || '');
        const formData = new FormData();
        const blob = new Blob([csvData.join('\n')], { type: 'text/csv' });
        const newFile = new File(
          [blob],
          totalChunks > 1 ? file.name.replace('.csv', `_${idx}.csv`) : file.name
        );
        formData.append('files', newFile);
        try {
          // api.http.config.baseUrl = 'https://import.stats.fm/api/v1';
          // eslint-disable-next-line no-await-in-loop
          await api.me.import({
            headers: {
              'Content-Type': null!,
            },
            body: formData,
          });

          event('IMPORT_upload_files');
          setRefetchCounter((c) => c + 1);
          if (z.length === 0)
            setLoadingProgress({ progress: 100, description: 'Uploaded' });
        } catch (e) {
          // @ts-expect-error
          toaster.error(JSON.stringify(e?.data ?? e).toString());
        }
        idx += 1;
      }
      api.http.config.baseUrl = oldUrl;
      toaster.message(`succesfully uploaded.. ${file.name}`);
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
        .
      </p>
      {user.isPlus ? (
        <>
          {importAvailable?.asBoolean() ? (
            <label
              onClick={() => event('IMPORT_select_files')}
              className="mt-2 block w-full cursor-pointer rounded-2xl border-0 bg-primary/10 py-3 px-5 text-center font-bold text-primary transition-colors duration-300 hover:bg-primary/20 active:bg-primary/5"
            >
              <input
                type="file"
                accept="text/csv,.csv"
                className="hidden"
                onChange={onFileChange}
              />
              Import a new file (unzip the zip file from Apple Music first,
              upload Play Activity and Daily History csv files one by one)
            </label>
          ) : (
            <h4 className="my-10 text-center text-neutral-400">
              Importing is currently disabled
            </h4>
          )}
          {!!(loadingProgress && loadingProgress.progress) && (
            <ProgressBar progress={loadingProgress} />
          )}
          <Divider className="my-5 border-neutral-600" />
          <ImportGroupedList refetchCounter={refetchCounter} />
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
