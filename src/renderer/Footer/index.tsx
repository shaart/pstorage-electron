import { useState } from 'react';
import { AppVersion, Channels } from 'shared/constants';
import './index.css';

const ipcRenderer = window.electron.ipcRenderer;

const Footer = () => {
    const [ appVersion, setAppVersion ] = useState('unknown');
    const [ appName, setAppName ] = useState('unknown');

    ipcRenderer.sendMessage(Channels.APP_VERSION, []);
    ipcRenderer.on(Channels.APP_VERSION, (args: AppVersion) => {
        setAppVersion(args.version);
        setAppName(args.name);
    });

    return <div className='Row'>
            <div id="appname">{appName}</div>
            <div id="version">{appVersion}</div>
        </div>;
};
  
  export default Footer;
  