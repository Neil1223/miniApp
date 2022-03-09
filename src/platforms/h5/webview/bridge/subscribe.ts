import { renderPage, initApp } from '../page';
import onNavigationBarChange from '../page/navigationBar';
import onRouteChange from '../page/route';

export default function initSubscribe(subscribe: ViewJSBridge['subscribe']) {
  subscribe('pageScrollTo', (e: any) => {
    console.log('通过api触发页面返回顶部', e);
  });

  subscribe('CREATE_APP', initApp);
  subscribe('RENDER_PAGE', renderPage);

  subscribe('onRouteChange', onRouteChange);
  subscribe('onNavigationBarChange', onNavigationBarChange);
  subscribe('onPullDownRefreshChange', (data: { status: 'start' | 'stop' }, webviewId: number) => {
    KipleViewJSBridge.emit(`onPullDownRefreshChange.${webviewId}`, data.status);
  });
}
