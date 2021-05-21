import { renderPage, initPage } from '../page';
import onRouteChange from '../page/route';

export default function initSubscribe(subscribe: ViewJSBridge['subscribe']) {
  subscribe('pageScrollTo', (e: any) => {
    console.log('通过api触发页面返回顶部', e);
  });

  subscribe('CREATE_APP', initPage);
  subscribe('RENDER_PAGE', renderPage);

  subscribe('onRouteChange', onRouteChange);
}
