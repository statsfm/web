import { useApi, useAuth } from '@/hooks';
import type { UserImport } from '@statsfm/statsfm.js';
import { useState, type FC, useEffect } from 'react';
import { MdWarning } from 'react-icons/md';
import { ImportItemSkeleton } from './ImportItemSkeleton';
import { ImportItem } from './ImportItem';
import { Button } from '../Button';

export const ImportList: FC<{
  refetchCounter: Date;
  triggerRefetch: () => void;
}> = ({ refetchCounter, triggerRefetch }) => {
  const { user } = useAuth();
  const api = useApi();
  const [imports, setImports] = useState<UserImport[]>([]);
  const [loading, setLoading] = useState(true);
  const [allowRefetch, setAllowRefetch] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const imports = await api.me.imports();
      setImports(
        imports
          .map((importItem) => ({
            ...importItem,
            createdAt: new Date(importItem.createdAt),
            updatedAt: new Date(importItem.updatedAt),
          }))
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      );
      setLoading(false);
    })();
  }, [refetchCounter]);

  if (!user) return null;

  if (imports.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <MdWarning className="text-5xl text-yellow-600" />
        <p className="mt-4 text-lg text-gray-500">
          It looks like you don&apos;t have any imports yet! Get started by
          uploading your data above!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2>Your imports</h2>
        <Button
          onClick={() => {
            setAllowRefetch(false);
            triggerRefetch();
            setTimeout(() => {
              setAllowRefetch(true);
            }, 30000);
          }}
          disabled={!allowRefetch}
        >
          Refresh
        </Button>
      </div>
      <ul role="list" className="divide-y divide-foreground pt-3">
        {loading
          ? Array(10)
              .fill(null)
              .map((_n, i) => <ImportItemSkeleton key={i} />)
          : imports.map((importItem) => (
              <ImportItem {...importItem} key={importItem.hash} />
            ))}
      </ul>
    </div>
  );
};
