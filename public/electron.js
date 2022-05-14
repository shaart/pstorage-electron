const electron = require("electron");
const isDev = require("electron-is-dev");
const log = require('electron-log');
const cfg = require('electron-cfg');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const localNodeJsUrl = "http://localhost:13456";

console.log = log.log;

let mainWindow;

function createWindow() {
    log.info("Creating main application window");
    const winCfg = cfg.window();
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        ...winCfg.options(),
    });
    loadingWindow = new BrowserWindow({
        width: 300,
        height: 300,
        transparent: true,
        frame: false,
        alwaysOnTop: true,
    });
    winCfg.assign(mainWindow);

    loadingWindow.loadFile('public/splash.html');
    loadingWindow.center();

    mainWindow.on("closed", () => (mainWindow = null));

    if (isDev) {
        setTimeout(function () {
            loadingWindow.close();

            log.info("Loading url into application window");
            mainWindow.loadURL(localNodeJsUrl);
            mainWindow.show();
        }, 3000);
    } else {
        log.info("Loading main index.html into application window");
        mainWindow.loadURL(`file://${path.join(__dirname, "../build/index.html")}`);

        mainWindow.once('ready-to-show', () => {
            mainWindow.show()
            loadingWindow.hide()
            loadingWindow.close()
        });
    }
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});

log.info("electron.js ran successfully");