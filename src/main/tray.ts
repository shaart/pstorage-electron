import { app, Tray, Menu } from 'electron';
import log from 'electron-log';
import { getAssetPath } from './util';

const APPLICATION_NAME = app.getName();
const APPLICATION_VERSION = app.getVersion();
const APPLICATION_MENU_ITEM_NAME = `${APPLICATION_NAME} v${APPLICATION_VERSION}`;
const APPLICATION_TOOLTIP = `${APPLICATION_NAME}`;

const ICON_PATH = 'icon16.png';

class TrayMenu {
  tray: Tray | null;

  constructor() {
    this.tray = null;
  }

  createTrayMenu(showMainWindow: () => void) {
    app
      .whenReady()
      .then(() => {
        const icon = getAssetPath(ICON_PATH);
        this.tray = new Tray(icon);

        if (process.platform === 'win32') {
          this.tray.on('click', () => showMainWindow());
        }

        const contextMenu = Menu.buildFromTemplate([
          {
            label: `${APPLICATION_MENU_ITEM_NAME}`,
            click: () => {
              showMainWindow();
            },
          },
          { type: 'separator' },
          { label: 'Passwords', submenu: [] },
          { type: 'separator' },
          {
            label: 'Exit',
            click: () => {
              app.exit(0);
            },
          },
        ]);

        this.tray.setContextMenu(contextMenu);
        this.tray.setToolTip(`${APPLICATION_TOOLTIP}`);
        this.tray.setTitle('This is my title');
        return this.tray;
      })
      .catch((error) => {
        log.error('Error on creating tray menu', error);
      });
  }
}

export default TrayMenu;
