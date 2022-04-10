import { initPage } from './page';

/**
 * 初始化 App，在 wx-app 中处理 app.css, tabBar
 */
export const initApp = (route?: string) => {
  route = route ? route : location.pathname;
  route = route.replace(/^\//, '');

  // 处理部署时含有html的情况
  if (/\.html/.test(route)) {
    const splitGroup = route.split('/');
    splitGroup.pop();
    route = splitGroup.join('/');
  }

  // 初始化App，使用 wx-app 替换 div#app 元素
  const rootEl: any = document.getElementById('app');
  if (!rootEl) {
    throw Error('No Root Element');
  }
  rootEl.parentNode.replaceChild(document.createElement('wx-app'), rootEl);

  // 初始化 page
  initPage(route);
};
