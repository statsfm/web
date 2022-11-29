import { initializeApp } from 'firebase/app';
import { getRemoteConfig } from 'firebase/remote-config';

const firebaseConfig = {
  apiKey: 'AIzaSyCphdFU5r_Vhe69W9QobLMVPEdK1oXljro',
  authDomain: 'statsfm-web.firebaseapp.com',
  projectId: 'statsfm-web',
  storageBucket: 'statsfm-web.appspot.com',
  messagingSenderId: '697312567631',
  appId: '1:697312567631:web:895bf586d9cc42d057253a',
};

const defaultConfig = {
  import_warning_message:
    'Due to many people uploading their files, it can take up to a few\nhours for your files to be processed succesfully.\n\nYou can close this page if your files are in the queue.',
  import_warning_visible: true,
  import_available: false,
};

type DefaultConfigType = typeof defaultConfig;

const initRemoteConfig = async () => {
  const app = initializeApp(firebaseConfig);
  const remoteConfig = getRemoteConfig(app);

  remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
  remoteConfig.defaultConfig = defaultConfig;

  // await fetchAndActivate(remoteConfig);
  return remoteConfig;
};

export { initRemoteConfig };
export type { DefaultConfigType };
