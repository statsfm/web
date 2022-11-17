import type * as statsfm from '@statsfm/statsfm.js';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

type ScopeContextType = {
  as: statsfm.UserPrivate | null;
  target: statsfm.UserPublic;
  fallback?: JSX.Element;
};

const ScopeContext = createContext<ScopeContextType | null>(null);

const ScopeContextProvider: FC<PropsWithChildren<ScopeContextType>> = ({
  children,
  as,
  target,
  fallback,
}) => {
  return (
    <ScopeContext.Provider value={{ target, as, fallback }}>
      {children}
    </ScopeContext.Provider>
  );
};

const useScopeContext = () => {
  const context = useContext(ScopeContext);
  // if (!context) throw new Error('ScopeContext not found');
  return context ?? null;
};

const usePrivacyScope = (
  value: keyof statsfm.UserPrivacySettings,
  asViewer = true
) => {
  const scopeContext = useScopeContext();

  if (!scopeContext) return null;

  const { target, as: viewer } = scopeContext;

  if (asViewer && viewer !== null && viewer.id === target.id) return true;
  if (target.privacySettings && target.privacySettings[value]) return true;

  return false;
};

type ScopeProps = PropsWithChildren<{
  value: keyof statsfm.UserPrivacySettings;
  fallback?: JSX.Element;
}>;

const PrivacyScope: FC<ScopeProps> = ({ children, value, fallback }) => {
  const scopeValid = usePrivacyScope(value);
  const scopeContext = useScopeContext();

  if (!scopeContext) throw new Error('ScopeContext not found');
  const { fallback: contextFallback } = scopeContext;

  if (scopeValid) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  return <>{contextFallback}</>;
};

const Scope = Object.assign(PrivacyScope, {
  Context: ScopeContextProvider,
});

export default Scope;
export { usePrivacyScope, useScopeContext };
export type { ScopeProps };
