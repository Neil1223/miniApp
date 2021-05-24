import { initPage, PageFactory } from './index';

interface IRouteChange {
  type: 'navigateTo' | 'redirectTo' | 'reLaunch' | 'switchTab' | 'navigateBack';
  options: {
    url: string;
    delta: number;
  };
}

const navigateBack = (delta: number = 1) => {
  history.back();
  const currentPage = PageFactory.getCurrentPage();
  const lastPage = PageFactory.getLastPage(delta);
  if (lastPage && lastPage.pageContainer && currentPage?.pageContainer) {
    lastPage.initScrollEvent();
    lastPage.resetBackground();
    lastPage.root.replaceChild(lastPage.pageContainer, currentPage.pageContainer);
    PageFactory.removePage(currentPage.__webviewId__);
    var styles = document.querySelectorAll(`style[path="${currentPage.__route__}"]`);
    if (styles.length) {
      styles.forEach((style) => {
        style.remove();
      });
    }
  }
};

const navigateTo = (url: string) => {
  location.hash = url || '';
  initPage(url);
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
