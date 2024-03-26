import { type FC } from 'react';
import clsx from 'clsx';
import type { UploadedImportFile } from '@/utils/imports';
import {
  UPLOADED_FILE_STATUS,
  UPLOADED_FILE_STATUS_COLORS,
  UploadedFilesStatus,
} from '@/utils/imports';
import { Platform } from '@/utils/statsfm';
import { Button } from '../Button';

export const UploadedItem: FC<
  UploadedImportFile & { index: number; onRemove: (index: number) => void }
> = (data) => (
  <li className="flex items-center justify-between gap-x-6 py-5">
    <div className="min-w-0">
      <div className="flex items-start gap-x-3">
        <p className="my-0 font-semibold leading-6 text-white">
          {data.name.replaceAll('Streaming_History_Audio_', '')}
        </p>
        <div
          className={clsx(
            'my-0 flex-none rounded-md bg-foreground px-2 py-1 text-xs font-medium',
            UPLOADED_FILE_STATUS_COLORS[data.status],
          )}
        >
          {UPLOADED_FILE_STATUS[data.status]}
        </div>
      </div>
      {data.service === Platform.SPOTIFY && (
        <div className="mt-1 flex items-center gap-x-2 text-sm leading-5 text-gray-500">
          <p className="truncate">
            {data.status === UploadedFilesStatus.Error
              ? data.error ?? 'Unknown error'
              : `aprox ${data.data.length.toLocaleString()} streams`}
          </p>
        </div>
      )}
    </div>
    <div className="flex flex-none gap-x-4">
      <Button
        onClick={() => data.onRemove(data.index)}
        className="bg-red-500 text-white hover:bg-red-700"
      >
        Remove file
      </Button>
    </div>
  </li>
);
