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
  properties: any = {};
  lifetimes: object = {};
  constructor(args: IRegisterComponent, webviewId: number) {
    this.__webviewId__ = webviewId;
    this.__componentId__ = args.componentId;
    this.__route__ = args.route;
    const options = ComponentConfig[this.__route__];

    for (const key in options) {
      if (key === 'properties') {
        for (const name in options[key]) {
          this.properties[name] = options[key][name].value;
        }
        continue;
      }
      if (key === 'lifetimes') {
        for (const lifetimeName in options[key]) {
          if (typeof options[key][lifetimeName] === 'function') {
            this.lifetimes[lifetimeName] = options[key][lifetimeName].bind(this);
          }
        }
        continue;
      }
      if (typeof options[key] === 'function') {
        this[key] = options[key];
      } else {
        this[key] = JSON.parse(JSON.stringify(options[key]));
      }
    }

    // 触发create生命周期
    this.__callPageLifeTime__('created');

    // 合并 props
    for (const prop in args.props) {
      if (this.properties[prop] !== undefined) {
        this.properties[prop] = args.props[prop];
      }
    }
  }

  __callPageLifeTime__(name: string, query?: any) {
    this.lifetimes[name] && this.lifetimes[name](query);
    this[name] && this[name](query);
  }

  public setData(data: Object) {
    Object.assign(this.data, data);
    const mergeDataProps = Object.assign({}, this.data, this.properties);
    const sendData = { options: { data: mergeDataProps, __componentId__: this.__componentId__ }, route: this.__route__ };
    KipleServiceJSBridge.publishHandler('RE_RENDER_COMPONENT', sendData, this.__webviewId__);
  }
}

/**
 * 用于注册一个小程序组件，接受一个 object 作为属性，用来指定页面的初始数据、生命周期回调、事件处理等。
 * @param {IPageOptions} Options
 */
export const Component = (options: IPageOptions) => {
  const globPageRegisterPath = getGlobPageRegisterPath();
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
  const mergeDataProps = Object.assign({}, componentInstance.data, componentInstance.properties);
  const options = { options: { data: mergeDataProps, __componentId__: componentInstance.__componentId__ }, route: args.route };

  KipleServiceJSBridge.publishHandler('RENDER_COMPONENT', options, webviewId);
  console.log('create component end.');
};
