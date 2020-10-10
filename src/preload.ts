import path from 'path';
import { contextBridge, remote } from 'electron';

console.log('preload loaded');

// Only passing message that Authing needs to the window https://github.com/Authing/Guard/blob/db9df517c00a5eb51e406377ee4d7bb097054b68/src/views/login/SocialButtonsList.vue#L82-L89
// https://stackoverflow.com/questions/55544936/communication-between-preload-and-client-given-context-isolation-in-electron
window.addEventListener(
  'message',
  (event) => {
    // DEBUG: console
    console.log(`event from window.addEventListener()`, event);
    if (typeof event?.data?.code === 'number' && event?.data?.data?.token) {
      window.postMessage(event.data, '*');
    }
  },
  false
);

contextBridge.exposeInMainWorld('api', {
  clearStorageData: () => {
    remote.session.defaultSession.clearStorageData();
  },
});

declare global {
  interface Window {
    api: {
      clearStorageData: () => void;
    };
  }
}
export {};

// on production build, if we try to redirect to http://localhost:3000 , we will reach chrome-error://chromewebdata/ , but we can easily get back
// this happens when we are redirected by OAuth login
const isDev = process.argv.includes('ELECTRON_IS_DEV');
const REACT_PATH = isDev
  ? 'http://localhost:3000'
  : `file://${path.resolve(__dirname, '..', '..', 'build', 'index.html')}`;
const CHROME_ERROR_PATH = 'chrome-error://chromewebdata/';

const CHECK_LOADED_INTERVAL = 500;
function refresh() {
  if (window.location.href === CHROME_ERROR_PATH) {
    window.location.replace(REACT_PATH);
  } else {
    setTimeout(refresh, CHECK_LOADED_INTERVAL);
  }
}
setTimeout(refresh, CHECK_LOADED_INTERVAL);
