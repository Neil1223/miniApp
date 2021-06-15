import Base from '@/webview/mixin/base';
import template from './template.html';

class App extends Base {
  static is = 'wx-app';
  static template = template;
  constructor() {
    super();
  }
  connectedCallback() {
    // 处理全局样式
    __AppCssCode__['app'] && __AppCssCode__['app']();

    // 处理 tabBar 组件
    if (window.__wxConfig.tabBar && window.__wxConfig.tabBar.list.length) {
      this.appendChild(document.createElement('wx-tabbar'));
    }

    // 处理 onShow/onHide 的监听
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        KipleViewJSBridge.publishHandler('onAppEnterForeground', {}, 1);
      } else {
        KipleViewJSBridge.publishHandler('onAppEnterBackground', {}, 1);
      }
    });
  }
}

export default App;
