declare module '*.tpl';

declare const VERSION: string;

declare const KipleViewJSBridge: ViewJSBridge;
declare const KipleServiceJSBridge: ServiceJSBridge;

declare interface HTMLElement {
  __hasTapEvent?: boolean;
}

interface IVirtualDom {
  tag: string | CreateIVirtualDomFunc;
  props: { [key: string]: any };
  children: IVirtualDom[];
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
  app: { [key: string]: { render: (data: Object) => IVirtualDom } };
  __wxConfig: {
    entryPagePath: string;
    pages: string[];
  };
}
