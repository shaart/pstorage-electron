import { app, Tray, Menu } from 'electron';
import log from 'electron-log';
import { getAssetPath } from './util';

class TrayMenu {
  tray: Tray;

  constructor() {
    const icon = getAssetPath('icon.ico');
    this.tray = new Tray(icon);
  }

  createTrayMenu() {
    app
      .whenReady()
      .then(() => {
        const icon = getAssetPath('icon.ico');
        this.tray = new Tray(icon);

        const contextMenu = Menu.buildFromTemplate([
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
        this.tray.setToolTip('pstorage');
        this.tray.setTitle('This is my title');
        return this.tray;
      })
      .catch((error) => {
        log.error('Error on creating tray menu', error);
      });
  }
}

export default TrayMenu;
