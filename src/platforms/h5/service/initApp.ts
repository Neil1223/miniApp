import { require as customRequire } from '@/core/service/helpers/require';
import { registerPage } from '@/core/service/page/page';
import { parserUrlSearch } from '@/util';

let __webviewId__ = 0; // 记录service层创建的webviewId

// 创建空的webview,并返回对应的Id
export const createWebview = () => {
  __webviewId__++;
  KipleServiceJSBridge.publishHandler('CREATE_PAGE', null, __webviewId__);
  return __webviewId__;
};

/*
 * 小程序的入口，初始化小程序
 * 暂定H5中: service.js 和 webview.js 运行在一起，不将 service.js 运行在 worker 中.
 */
export const initApp = () => {
  // 获取初次进入的页面路由，H5：https://www.kiple.com/aaa/bbb, App: file://_www/_service.html?microAppId=xxx&route=aaa/bbb
  let route = location.pathname.replace(/^\//, '');
  const query = parserUrlSearch(location.search);
  // 处理部署H5时含有 .html 的情况
  if (/\.html/.test(route)) {
    const splitGroup = route.split('/');
    splitGroup.pop();
    route = splitGroup.join('/');
  }

  // 创建 H5 的页面容器
  KipleServiceJSBridge.publishHandler('CREATE_APP', null, 0);

  // 创建 Page
  var webviewId = createWebview();

  customRequire('app.js');

  registerPage(route, webviewId, query);
};
