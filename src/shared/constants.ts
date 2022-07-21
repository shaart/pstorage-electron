export enum Channels {
    IPC_EXAMPLE = 'ipc-example',
    APP_VERSION = 'app_version',
  }
 
export interface AppVersion {
  version: string;
  name: string;
}