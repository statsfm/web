import type { useToaster } from '@/hooks';
import type { Platform } from '@statsfm/statsfm.js';
import type { SetStateAction } from 'react';
import type { Accept } from 'react-dropzone';
import type { event } from 'nextjs-google-analytics';

export const IMPORT_STATUS = {
  '-2': 'Invalid stream data!',
  '-1': 'Errored!',
  '0': 'Queued (waiting to be processed)',
  '1': 'Processing',
  '2': 'Successfully processed',
} as const;

export enum UploadedFilesStatus {
  InvalidData = -2,
  Error = -1,
  Checking = 0,
  Ready = 1,
  Uploading = 2,
  Uploaded = 3,
  Failed = 4,
}

export interface ImportService {
  id: Platform;
  name: string;
  enabled: boolean;
  acceptFiles: Accept;
  handleFileUpload: (file: File[]) => Promise<void> | void;
}

export const UPLOADED_FILE_STATUS = {
  [UploadedFilesStatus.Error]: 'Error',
  [UploadedFilesStatus.InvalidData]: 'Invalid stream data',
  [UploadedFilesStatus.Checking]: 'Checking file',
  [UploadedFilesStatus.Ready]: 'Ready to upload',
  [UploadedFilesStatus.Uploading]: 'Uploading...',
  [UploadedFilesStatus.Uploaded]: 'Uploaded successfully',
  [UploadedFilesStatus.Failed]: 'Failed to upload',
} as const;

export const IMPORT_STATUS_COLORS = {
  '2': 'text-green-400 ring-green-400/30',
  '1': 'text-gray-400 ring-gray-400/30',
  '0': 'text-yellow-400 ring-yellow-400/30',
  '-1': 'text-red-400 ring-red-400/30',
  '-2': 'text-red-400 ring-red-400/30',
} as const;

export const UPLOADED_FILE_STATUS_COLORS = {
  [UploadedFilesStatus.Error]: 'text-red-400 ring-red-400/30',
  [UploadedFilesStatus.InvalidData]: 'text-red-400 ring-red-400/30',
  [UploadedFilesStatus.Checking]: 'text-gray-400 ring-gray-400/30',
  [UploadedFilesStatus.Ready]: 'text-gray-400 ring-gray-400/30',
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

export function isJSONParsable(input: string) {
  try {
    JSON.parse(input);
    return true;
  } catch (error) {
    return false;
  }
}

export type UploadedImportFile = {
  id: string;
  name: string;
  addedAt: Date;
  status: UploadedFilesStatus;
  service: Platform;
  error?: string;
} & (
  | { status: UploadedFilesStatus.Error; error: string }
  | {
      status: UploadedFilesStatus.Checking;
    }
  | {
      status: Exclude<
        UploadedFilesStatus,
        UploadedFilesStatus.Error | UploadedFilesStatus.Checking
      >;
      data: any;
      contentType: string;
    }
);

export type ToasterType = ReturnType<typeof useToaster>;

export type ImportServiceFunction = (data: {
  toaster: ToasterType;
  setUploadedFiles: (value: SetStateAction<UploadedImportFile[]>) => void;
  event: typeof event;
}) => ImportService;
