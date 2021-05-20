import { checkPageInPagesJson } from '@/service/core/page';
import { parserUrl } from '@/util';

interface IRouteParams {
  url?: string;
  delta?: number;
}

const shouldCheckUrlTypes = ['navigateTo', 'redirectTo', 'switchTab'];

const onAppRoute = (type: string, args?: IRouteParams) => {
  const { url, delta } = args || {};
  const { route } = parserUrl(url || '');
  if (shouldCheckUrlTypes.includes(type)) {
    if (!checkPageInPagesJson(route)) {
      throw new Error(`Page register error. ${route} has not been declared in pages.json.`);
    }
  }
  // 路由跳转应该使用一个统一的 Handler，传递不同的参数
  switch (type) {
    case 'navigateTo':
      location.hash = url || '';
      KipleServiceJSBridge.publishHandler('CREATE_APP', url, 0);
      break;
    case 'navigateBack':
      history.back();
      KipleServiceJSBridge.publishHandler('PAGE_BACK', { type, delta }, 0);
      break;
    default:
      break;
  }
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
