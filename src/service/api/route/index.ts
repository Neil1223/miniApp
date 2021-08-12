import { callPageRouteHook, checkPageInPagesJson, checkPageInTabList } from '@/service/core/page';
import { parserUrl } from '@/util';

interface IRouteParams {
  url?: string;
  delta?: number;
}

const shouldCheckUrlTypes = ['navigateTo', 'redirectTo', 'switchTab', 'reLaunch'];

// 我需要在这里触发page的hide，show的生命周期
export const onAppRoute = (type: string, args?: IRouteParams) => {
  const { url } = args || {};
  let { route } = parserUrl(url || '');
  route = route.replace(/^\//, '');

  if (shouldCheckUrlTypes.includes(type)) {
    if (!checkPageInPagesJson(route)) {
      throw new Error(`Page register error. ${route} has not been declared in pages.json.`);
    }
  }

  switch (type) {
    case 'switchTab':
      if (!checkPageInTabList(route)) {
        throw new Error(`can not switch to no-tabBar page`);
      }
      break;
    case 'navigateTo':
    case 'redirectTo':
      if (checkPageInTabList(route)) {
        throw new Error(`can not ${type} a tabbar page`);
      }
      break;
    default:
      break;
  }

  // 通知 service 触发 Page 的生命周期函数，并删除内存的多余的 Page
  callPageRouteHook(type, args || {});

  // 通知 view 层进行路由处理
  KipleServiceJSBridge.publishHandler('onRouteChange', { type, options: args || {} }, 0);

  return {
    errMsg: type + ':ok',
  };
};

export const navigateTo = (args: IRouteParams) => {
  return onAppRoute('navigateTo', args);
};

export const navigateBack = (args?: IRouteParams) => {
  return onAppRoute('navigateBack', args);
};

export const redirectTo = (args: IRouteParams) => {
  return onAppRoute('redirectTo', args);
};

export const reLaunch = (args: IRouteParams) => {
  return onAppRoute('reLaunch', args);
};

export const switchTab = (args: IRouteParams) => {
  return onAppRoute('switchTab', args);
};
