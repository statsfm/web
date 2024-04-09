declare namespace MusicKit {
  function configure(configuration: Configuration): Promise<MusicKitInstance>;

  function getInstance(): MusicKitInstance;

  interface Configuration {
    developerToken: string;
    app: AppConfiguration;
    bitrate?: PlaybackBitrate;
    storefrontId?: string;
  }

  interface AppConfiguration {
    name: string;
    build?: string;
    icon?: string;
  }

  interface MusicKitInstance {
    authorize(): Promise<string>;
  }
}
