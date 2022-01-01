import { BacktrackArtist } from './artist';

export interface BacktrackGenre {
  related: string[];
  artists: BacktrackArtist[];
}
