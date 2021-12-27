export interface TotalSizeItem {
  current: {
    count: number;
    date: string;
  };
  previous: {
    count: number;
    date: string;
  };
}

export interface TotalSize {
  users: TotalSizeItem;
  plusUsers: TotalSizeItem;
  streams: TotalSizeItem;
  tracks: TotalSizeItem;
  artists: TotalSizeItem;
  albums: TotalSizeItem;
}
