import Link from 'next/link';
import type { FC } from 'react';
import type { ScopeProps } from '../PrivacyScope';
import Scope, { useScopeContext } from '../PrivacyScope';
import { StatsCard } from '../StatsCard';

export const ImportRequiredScope: FC<ScopeProps> = ({ children, value }) => {
  const scopeContext = useScopeContext();

  if (!scopeContext) throw new Error('ScopeContext not found');
  const { target, as: viewer } = scopeContext;

  if (target.hasImported) {
    return <Scope value={value}>{children}</Scope>;
  }

  let Content = (
    <>
      Ask {target.displayName} to{' '}
      <Link className="underline" href="/settings/imports">
        import their streaming history
      </Link>{' '}
      to view this
    </>
  );

  if (viewer !== null && target.id === viewer.id)
    Content = (
      <>
        This feature requires{' '}
        <Link className="underline" href="/settings/imports">
          import of streams
        </Link>
      </>
    );

  return (
    <div className="relative w-full">
      <div className="blur-sm">
        <ul className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          {['minutes streamed', 'hours streamed', 'streams'].map((label, i) => (
            <StatsCard key={i} label={label} value="?" />
          ))}
        </ul>
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <p className="m-0 text-text-grey">{Content}</p>
      </div>
    </div>
  );
};
