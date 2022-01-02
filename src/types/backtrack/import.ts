export interface BacktrackUserImport {
  id: number;
  hash: string;
  path: string;
  userId: string;
  count: number;
  status: number;
  createdAt: Date;
  updatedAt: Date;
  serverId: number;
  name?: string;
  error?: string;
}
