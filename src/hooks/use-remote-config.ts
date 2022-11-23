import type { DefaultConfigType } from '@/utils/RemoteConfig';
import { initRemoteConfig } from '@/utils/RemoteConfig';
import type { RemoteConfig, Value } from 'firebase/remote-config';
import { getValue } from 'firebase/remote-config';
import { useState } from 'react';

const remoteConfigCache: RemoteConfig | null = null;

export const useRemoteConfig = () => {
  const [remoteConfig, setRemoteConfig] = useState<RemoteConfig | null>(null);

  if (remoteConfigCache) setRemoteConfig(remoteConfigCache);
  if (!remoteConfig) initRemoteConfig().then(setRemoteConfig);

  return remoteConfig;
};

export const useRemoteValue = (key: keyof DefaultConfigType): null | Value => {
  const remoteConfig = useRemoteConfig();
  if (!remoteConfig) return null;
  const val = getValue(remoteConfig, key);
  return val;
};
