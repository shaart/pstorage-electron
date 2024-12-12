import { useState } from 'react';
import { AppVersion, Channels } from 'shared/constants';
import './index.css';

const ipcRenderer = window.electron.ipcRenderer;

const Footer = () => {
    const [ appVersion, setAppVersion ] = useState('unknown');
    const [ appName, setAppName ] = useState('unknown');

    ipcRenderer.on(Channels.APP_VERSION, (args: AppVersion) => {
        setAppVersion(args.version);
        setAppName(args.name);
    });

    return <div className='Row'>
            <div id="appname">{appName}</div>
            <div id="version">{appVersion}</div>
        </div>;
};

ipcRenderer.sendMessage(Channels.APP_VERSION, []);
  
export default Footer;
  