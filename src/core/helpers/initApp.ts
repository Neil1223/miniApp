import { require as customRequire } from './require';

const initApp = () => {
  customRequire('app.js');
  KipleServiceJSBridge.publishHandler('CREATE_APP', null, 0);
};

export default initApp;
