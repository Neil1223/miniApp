declare module '*.tpl';

declare const VERSION: string;

declare const KipleViewJSBridge: ViewJSBridge;
declare const KipleServiceJSBridge: ServiceJSBridge;

declare interface HTMLElement {
  __hasTapEvent?: boolean;
}

interface Window {
  serviceJSBridge: {
    subscribe: ServiceJSBridge['subscribe'];
    publishHandler: ServiceJSBridge['publishHandler'];
    subscribeHandler: ServiceJSBridge['subscribeHandler'];
  };
  viewJSBridge: {
    subscribe: ViewJSBridge['subscribe'];
    publishHandler: ViewJSBridge['publishHandler'];
    subscribeHandler: ViewJSBridge['subscribeHandler'];
  };
  define: Function;
  require: Function;
}
