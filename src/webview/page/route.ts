import { createBrowserHistory } from 'history';
import { initPage, PageFactory } from './index';

export const history = createBrowserHistory();

export const location = history.location;

let navigateBackByAPI = false;

// 监听路由变化，init 页面内容
history.listen(({ location }) => {
  // 如果是通过api的方式进行路由返回的，那么不需要重新 init 页面
  if (navigateBackByAPI) {
    navigateBackByAPI = false;
    return;
  }
  initPage(location.pathname.replace('/', ''));
});

interface IRouteChange {
  type: 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab' | 'navigateBack';
  options: {
    url: string;
    delta: number;
  };
}

const navigateBack = (delta: number = 1) => {
  navigateBackByAPI = true;
  history.go(0 - delta);
  const currentPage = PageFactory.getCurrentPage();
  const lastPage = PageFactory.getLastPage(delta);
  if (lastPage && lastPage.pageContainer && currentPage?.pageContainer) {
    lastPage.initScrollEvent();
    lastPage.resetBackground();
    lastPage.root.replaceChild(lastPage.pageContainer, currentPage.pageContainer);
    // 移除页面
    PageFactory.deleteLastPage(delta);
    // 移除样式，应该放到 PageFactory 中？
    var styles = document.querySelectorAll(`style[path="${currentPage.__route__}"]`);
    if (styles.length) {
      styles.forEach((style) => {
        style.remove();
      });
    }
  }
};

const navigateTo = (url: string) => {
  const pathname = url && url[0] !== '/' ? '/' + url : url;
  history.push(pathname);
};

const onRouteChange = (data: IRouteChange) => {
  switch (data.type) {
    case 'navigateBack':
      navigateBack(data.options.delta);
      break;
    case 'navigateTo':
      navigateTo(data.options.url);
      break;
    default:
      break;
  }
};

export default onRouteChange;
