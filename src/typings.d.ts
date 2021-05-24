declare module '*.tpl';
declare module '*.html';

declare const VERSION: string;
declare const __AppCssCode__: { [key: string]: Function };

declare const KipleViewJSBridge: ViewJSBridge;
declare const KipleServiceJSBridge: ServiceJSBridge;
declare const getCurrentPages: () => { __webviewId__: number }[];

declare interface HTMLElement {
  __hasTapEvent?: boolean;
}

interface IVirtualDom {
  tag: string | CreateIVirtualDomFunc;
  props: { [key: string]: any };
  children: IVirtualDom[];
}

interface IWindow {
  backgroundColor: string;
  backgroundTextStyle: string;
  navigationBarBackgroundColor: string;
  navigationBarTextStyle: 'black' | 'white';
  navigationBarTitleText: string;
  navigationStyle: 'default' | 'custom' | 'transparent'; // custom 是取消原生导航栏,transparent 是透明渐变导航
  enablePullDownRefresh: boolean; // 开启下拉刷新
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
    page: { [key: string]: IWindow };
    global: {
      window: IWindow;
    };
  };
}
