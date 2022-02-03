export * from './album';
export * from './artist';
export * from './audio-analysis';
export * from './audio-features';
export * from './top';
export * from './track';
export * from './stream';
export * from './friend';
export * from './import';
export * from './genre';
export * from './user';

export interface BacktrackObject {
  id: number;
  updatedAt?: Date;
}
export type BacktrackRange = 'weeks' | 'months' | 'lifetime';
