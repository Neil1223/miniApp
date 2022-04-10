import { renderPage } from '../page/page';
import { initApp } from '../page/app';
import onNavigationBarChange from '../page/navigationBar';
import onRouteChange from '../page/route';
import { renderComponent } from '../page/component';

export default function initSubscribe(subscribe: ViewJSBridge['subscribe']) {
  subscribe('pageScrollTo', (e: any) => {
    console.log('通过api触发页面返回顶部', e);
  });

  subscribe('CREATE_APP', initApp);
  subscribe('RENDER_PAGE', renderPage);
  subscribe('RE_RENDER_PAGE', renderPage);
  subscribe('RENDER_COMPONENT', (options: any, webviewId: number) => {
    renderComponent(options, webviewId);
  });
  subscribe('RE_RENDER_COMPONENT', renderComponent);

  subscribe('onRouteChange', onRouteChange);
  subscribe('onNavigationBarChange', onNavigationBarChange);
  subscribe('onPullDownRefreshChange', (data: { status: 'start' | 'stop' }, webviewId: number) => {
    KipleViewJSBridge.emit(`onPullDownRefreshChange.${webviewId}`, data.status);
  });
}
