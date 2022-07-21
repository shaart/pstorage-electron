import { Channels } from "shared/constants";

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage<T>(channel: Channels, args: T): void;
        on<T>(
          channel: Channels,
          func: (args: T) => void
        ): (() => void) | undefined;
        once(channel: Channels, func: (...args: unknown[]) => void): void;
      };
    };
  }
}

export {};