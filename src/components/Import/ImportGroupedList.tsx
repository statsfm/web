import { useApi, useAuth } from '@/hooks';
import type { UserImport } from '@statsfm/statsfm.js';
import { useState, type FC, useEffect } from 'react';
import { BiDownArrow, BiUpArrow } from 'react-icons/bi';
import { ImportItem } from './ImportItem';

export const ImportGroupedList: FC<{ refetchCounter: number }> = ({
  refetchCounter,
}) => {
  const { user } = useAuth();
  const api = useApi();
  const [imports, setImports] = useState<(UserImport & { group?: string })[]>(
    []
  );
  const [groups, setGroups] = useState<{
    [key: string]: (UserImport & { group?: string })[];
  }>({});
  const [selectedGroup, setSelectedGroup] = useState<string>();

  useEffect(() => {
    (async () => {
      let imports: (UserImport & { group?: string })[] = await api.me.imports();
      const groups: { [key: string]: (UserImport & { group?: string })[] } = {};
      imports = imports
        .map((importItem) => {
          let group = '';
          if (
            importItem?.name &&
            /.*_\d*\.csv$/.test(importItem.name) &&
            importItem?.name?.match(/(.*)_\d*\.csv$/)?.length
          ) {
            const filenameChecker = importItem.name.match(/(.*)_\d*\.csv$/);
            group =
              (filenameChecker?.length &&
                filenameChecker?.length > 0 &&
                filenameChecker[1]) ||
              '';
            if (group) {
              if (!groups[group]) groups[group] = [importItem];
              else {
                // @ts-ignore
                groups[group].push(importItem);
              }
            }
          }
          return {
            ...importItem,
            group,
            createdAt: new Date(importItem.createdAt),
            updatedAt: new Date(importItem.updatedAt),
          };
        })
        .filter((i) => i?.createdAt)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setGroups(groups);

      setImports(imports.filter((i) => !i.group));
    })();
  }, [refetchCounter]);

  if (!user) return null;

  return (
    <>
      {Object.keys(groups).length
        ? Object.keys(groups).map((group) => {
            return (
              <div key={group}>
                <div
                  onClick={() => {
                    return selectedGroup === group
                      ? setSelectedGroup('')
                      : setSelectedGroup(group);
                  }}
                  className={`mt-3 flex w-full cursor-pointer items-center justify-between gap-x-6 rounded-xl ${
                    selectedGroup === group
                      ? 'bg-primary/90 hover:bg-primary/100'
                      : 'bg-primary/10 hover:bg-primary/20'
                  } p-3 py-5 font-bold`}
                >
                  {group}
                  <span
                    className={`${selectedGroup === group && 'text-white'}`}
                  >
                    {Object.entries(
                      // @ts-ignore
                      groups[group]
                        .filter((a) => a.status >= -1)
                        .reduce((a: { [key: string]: number }, s) => {
                          // eslint-disable-next-line no-param-reassign
                          if (!a[s.status]) a[s.status] = 0;
                          // eslint-disable-next-line no-param-reassign
                          a[s.status] += 1;
                          return a;
                        }, {})
                    )
                      .map(([key, count]) => {
                        let importStatus = '';
                        if (+key === -1) importStatus = 'Error';
                        else if (+key === 0) importStatus = 'Queued';
                        else if (+key === 1) importStatus = 'Processing';
                        else if (+key === 2) importStatus = 'Processed';
                        return `${importStatus}: ${count}`;
                      })
                      .join(', ')}
                  </span>
                  <span
                    className={`${selectedGroup === group && 'text-white'}`}
                  >
                    Streams parsed:{' '}
                    {
                      // @ts-ignore
                      groups[group].reduce((a, s) => a + s.count, 0)
                    }
                  </span>
                  {selectedGroup === group ? (
                    <BiUpArrow className="text-white" />
                  ) : (
                    <BiDownArrow />
                  )}
                </div>
                {selectedGroup && selectedGroup === group ? (
                  <ul>
                    {
                      // @ts-ignore
                      groups[group].map((importItem) => (
                        <ImportItem {...importItem} key={importItem.hash} />
                      ))
                    }
                  </ul>
                ) : null}
              </div>
            );
          })
        : null}
      {imports.filter((i) => !i.group)?.length ? (
        <ul>
          {imports
            .filter((i) => !i.group)
            .map((importItem) => (
              <ImportItem {...importItem} key={importItem.hash} />
            ))}
        </ul>
      ) : null}
    </>
  );
};
