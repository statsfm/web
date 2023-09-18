import { useApi, useAuth } from '@/hooks';
import type { UserImport } from '@statsfm/statsfm.js';
import { useState, type FC, useEffect } from 'react';
import { MdWarning } from 'react-icons/md';
import { ImportItemSkeleton } from './ImportItemSkeleton';
import { ImportItem } from './ImportItem';

export const ImportList: FC<{ refetchCounter: number }> = ({
  refetchCounter,
}) => {
  const { user } = useAuth();
  const api = useApi();
  const [imports, setImports] = useState<UserImport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
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
          using the <span className="font-semibold">Import</span> button above.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Imported files</h2>
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
