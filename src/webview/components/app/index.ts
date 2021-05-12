import Base from '@/webview/mixin/base';
import Hover from '@/webview/mixin/hover';
import template from './index.tpl';

class AppPage extends Hover(Base) {
  static is = 'wx-page';
  static template = template;
  constructor() {
    super();
  }
  connectedCallback() {
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        KipleViewJSBridge.publishHandler('onAppEnterForeground', {}, 1);
      } else {
        KipleViewJSBridge.publishHandler('onAppEnterBackground', {}, 1);
      }
    });
  }
}

export default AppPage;
