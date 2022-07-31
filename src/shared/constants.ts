export enum Channels {
    IPC_EXAMPLE = 'ipc-example',
    APP_VERSION = 'app_version',
    GET_CURRENT_USER = 'get_current_user',
  }
 
export interface AppVersion {
  version: string;
  name: string;
}

type UUID = string;

export interface AbstractAuditable {
  id: UUID;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends AbstractAuditable {
  name: string;
  masterPassword: string;
  passwords: Password[]
}

export interface Password extends AbstractAuditable {
  userId: UUID;
  alias: string;
  value: string;
}