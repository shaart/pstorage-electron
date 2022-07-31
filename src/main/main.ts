/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath, getAssetPath } from './util';
import TrayMenu from './tray';
import Dao from './db/dao';
import { Channels, Password, User } from '../shared/constants';

const isDev = require('electron-is-dev');

const APPLICATION_VERSION = app.getVersion();

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon64.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    autoUpdater.checkForUpdatesAndNotify().catch((error) => {
      log.error('An error occurred on updates check with notifying', error);
    });

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  const trayMenu = new TrayMenu();
  trayMenu.createTrayMenu(() => {
    if (mainWindow == null) {
      createWindow();
      return;
    }

    mainWindow.show();
  });

  const dao = new Dao();
  dao.runSample();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);

ipcMain.on(Channels.APP_VERSION, (event) => {
  log.info(`Got \'${Channels.APP_VERSION}\' event`);
  const appVersion = isDev ? APPLICATION_VERSION : app.getVersion();
  event.sender.send(Channels.APP_VERSION, {
    version: appVersion,
    name: app.getName(),
  });
});

ipcMain.on(Channels.GET_CURRENT_USER, (event) => {
  // todo call the dao.js
  log.info(`Got \'${Channels.GET_CURRENT_USER}\' event`);

  event.sender.send(Channels.GET_CURRENT_USER, {
    id: "ae24be20-21c9-45f7-bbf7-1969f25e478b",
    createdAt: new Date(),
    updatedAt: new Date(),
    version: 1,
    name: "test",
    masterPassword: "123",
    passwords: [
      {
        id: "fbdb58e5-870e-445f-b8ea-16cb539d7cca",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "ae24be20-21c9-45f7-bbf7-1969f25e478b",
        alias: "main pwd",
        value: "sampleMainPwdValue",
      },
      {
        id: "afeda913-a7c1-4eb2-94e1-1642aa3ea0eb",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "ae24be20-21c9-45f7-bbf7-1969f25e478b",
        alias: "second pwd",
        value: "secondPwdValue",
      },
    ] as Password[],
  } as User);
});

ipcMain.on('restart_app', () => {
  log.info('Got "restart_app" event in main process.');
  autoUpdater.quitAndInstall(true, true);
  app.exit();
});

if (!isDev) {
  autoUpdater.on('update-available', () => {
    log.info('Got "update-available" event. Sending to main window...');
    mainWindow?.webContents.send('update_available');
  });
  autoUpdater.on('update-downloaded', () => {
    log.info('Got "update-downloaded" event. Sending to main window...');
    mainWindow?.webContents.send('update_downloaded');
  });
}
