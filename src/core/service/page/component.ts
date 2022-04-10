import { isPlainObject } from '@/util/util';
import { require as customRequire } from '../helpers/require';
import { checkPageInPagesJson, getGlobPageRegisterPath } from './app';
import { IAppPage, IPageOptions, IRegisterComponent } from './index.d';

const ComponentConfig = {};
const AppComponents: IAppPage[] = [];

export class WrapperComponent {
  __webviewId__: number;
  __componentId__: number;
  __route__: string;
  data: any;
  properties: any;
  constructor(args: IRegisterComponent, webviewId: number) {
    this.__webviewId__ = webviewId;
    this.__componentId__ = args.componentId;
    this.__route__ = args.route;
    const options = ComponentConfig[this.__route__];

    for (const key in options) {
      if (typeof options[key] === 'function') {
        this[key] = options[key];
      } else {
        this[key] = JSON.parse(JSON.stringify(options[key]));
      }
    }
  }
  __callPageLifeTime__(name: string, query?: any) {
    this[name] && this[name](query);
  }
  public setData(data: Object) {
    Object.assign(this.data, data);
    const mergeDataProps = Object.assign({}, this.data, this.properties || {});
    const sendData = { options: { data: mergeDataProps }, route: this.__route__ };
    KipleServiceJSBridge.publishHandler('RE_RENDER_COMPONENT', sendData, this.__webviewId__);
  }
}

/**
 * 用于注册一个小程序组件，接受一个 object 作为属性，用来指定页面的初始数据、生命周期回调、事件处理等。
 * @param {IPageOptions} Options
 */
export const Component = (options: IPageOptions) => {
  const globPageRegisterPath = getGlobPageRegisterPath()
  if (!checkPageInPagesJson(globPageRegisterPath)) {
    throw new Error(`Component register error. ${globPageRegisterPath} has not been declared.`);
  }
  if (!isPlainObject(options)) {
    throw new Error(`Component's option should be an object. please see ${globPageRegisterPath}.js`);
  }
  console.info(`Add Component: ${globPageRegisterPath}`);
  ComponentConfig[globPageRegisterPath] = options;
};

export const registerComponent = (args: IRegisterComponent, webviewId: number) => {
  console.log('create component start.');
  if (!ComponentConfig[args.route]) {
    customRequire(args.route);
  }

  const componentInstance = new WrapperComponent(args, webviewId);
  const appPage = { page: componentInstance, route: args.route, webviewId: webviewId };
  AppComponents.push(appPage as any);
  // pageInstance.__callPageLifeTime__('onLoad', query);
  // topWebviewId = webviewId;
  const data = { options: componentInstance, route: args.route };
  KipleServiceJSBridge.publishHandler('RENDER_COMPONENT', data, webviewId);
  // pageInstance.__callPageLifeTime__('onShow');
  console.log('create component end.');
};
