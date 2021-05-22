import Base from '@/webview/mixin/base';
import template from './template.html';

class PageHead extends Base {
  static is = 'wx-page-head';
  static template = template;
  static get properties(): any {
    return {
      navigationBarTextStyle: { type: String, value: 'black', observer: '_onNavigationBarChange' },
      navigationBarBackgroundColor: { type: String, value: '#F7F7F7', observer: '_onNavigationBarChange' },
      navigationBarTitleText: { type: String, value: '', observer: '_onNavigationBarChange' },
      navigationStyle: { type: String, value: 'default', observer: '_onNavigationBarChange' },
    };
  }
  constructor() {
    super();
    const backBtn = this.shadowRoot?.querySelector('.uni-page-head-back') as HTMLElement;
    backBtn.addEventListener('click', () => {
      // 传递消息给 Service 层; 在 App 中 Service 层直接就是监听 webview 的 back 事件进行事件触发
      KipleViewJSBridge.publishHandler('navigateBack', null, 0);
    });
  }
  _onNavigationBarChange(_: string, newValue: string, name: string) {
    const headerBody = this.shadowRoot?.querySelector('.uni-page-head-bd') as HTMLElement;
    const header = this.shadowRoot?.querySelector('.uni-page-head') as HTMLElement;
    switch (name) {
      case 'navigationBarTextStyle':
        header.style.color = newValue;
        break;
      case 'navigationBarBackgroundColor':
        header.style.backgroundColor = newValue;
        break;
      case 'navigationBarTitleText':
        headerBody.innerText = newValue;
        break;
      case 'navigationStyle':
        newValue === 'custom' && this.remove();
        newValue === 'transparent' && this.setTransparent();
        break;
      default:
        break;
    }
  }
  setTransparent() {
    KipleViewJSBridge.on('onPageScroll', (e: any) => {
      console.log('----333---', e);
    });
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

export default PageHead;
