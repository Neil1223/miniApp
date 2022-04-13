import { require as customRequire } from '@/core/service/helpers/require';
import { registerPage } from '@/core/service/page/page';
import { parserUrlSearch } from '@/util';

let __webviewId__ = 0; // 记录service层创建的webviewId

// 创建空的webview,并返回对应的Id
export const createWebview = () => {
  __webviewId__++;
  plus.webview.create('file://_www/view.html', __webviewId__);
  return __webviewId__;
};

/*
 * 小程序的入口，初始化小程序
 * 暂定webview中: service.js 运行在一个含有 service.html 的 webview 中, webview.js 运行在每个渲染层的 webview 中
 */
export const initApp = () => {
  // 获取初次进入的页面路由，H5：https://www.kiple.com/aaa/bbb, App: file://_www/service.html?microAppId=xxx&route=aaa/bbb
  const AppQuery = parserUrlSearch(location.search);
  const route = AppQuery.route ? AppQuery.route : '';
  const query = AppQuery.query ? AppQuery.query : undefined;

  // 创建webview
  const webviewId = createWebview();

  customRequire('app.js');

  registerPage(route, webviewId, query);
};
