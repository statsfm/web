import { initializeApp } from 'firebase/app';
import { fetchAndActivate, getRemoteConfig } from 'firebase/remote-config';

const firebaseConfig = {
  apiKey: 'AIzaSyCphdFU5r_Vhe69W9QobLMVPEdK1oXljro',
  authDomain: 'statsfm-web.firebaseapp.com',
  projectId: 'statsfm-web',
  storageBucket: 'statsfm-web.appspot.com',
  messagingSenderId: '697312567631',
  appId: '1:697312567631:web:895bf586d9cc42d057253a',
};

const defaultConfig = {
  import_warning_visible: false,
  import_warning_message:
    'We\u0027re currently experiencing some issues and will be back soon! Please bear with us 😅',
  import_available: false,
  gift_show_notice: false,
  gift_notice_text: '',
};

type DefaultConfigType = typeof defaultConfig;

const initRemoteConfig = async () => {
  const app = initializeApp(firebaseConfig);
  const remoteConfig = getRemoteConfig(app);

  remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
  remoteConfig.defaultConfig = defaultConfig;

  await fetchAndActivate(remoteConfig);
  return remoteConfig;
};

export { initRemoteConfig };
export type { DefaultConfigType };
