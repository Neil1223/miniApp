import { getHashPath } from '@/util';
import Base from '@/webview/mixin/base';
import { createElement as _h, render } from '@/webview/nodeParser/render';
import template from './template.html';

class App extends Base {
  static is = 'wx-tabbar';
  static template = template;
  showTabBar = false;
  constructor() {
    super();
    // 创建元素
    this.createChild();
  }
  connectedCallback() {
    // 初次触发active
    this.onRouteChange();

    // 处理路由的监听
    window.addEventListener('hashchange', ({ newURL, oldURL }) => {
      console.log('newURL:', newURL, '\noldURL', oldURL);
      this.onRouteChange(newURL, oldURL);
    });
  }
  createChild() {
    const { list, borderStyle, backgroundColor } = window.__wxConfig.tabBar;
    const items = list.map((item) => _h('div', { className: 'uni-tabbar__item' }, _h('div', null, _h('div', null, item.text))));
    const borderView = _h('div', {
      className: 'uni-tabbar__border',
      style: { backgroundColor: borderStyle === 'white' ? 'rgba(255, 255, 255, 0.33)' : 'rgba(0, 0, 0, 0.33)' },
    });
    render(_h('div', { className: 'uni-tabbar', style: { backgroundColor } }, borderView, ...items), (this as any).shadowRoot);
  }
  show() {
    this.showTabBar = true;
    this.style.display = 'block';
  }
  hide() {
    this.showTabBar = false;
    this.style.display = 'none';
  }
  changeActive(index: number) {}
  onRouteChange(newURL: string = '', oldURL?: string) {
    const tabList = window.__wxConfig.tabBar.list.map((item) => item.pagePath);
    let newPath = getHashPath(newURL);
    if (!newPath) {
      newPath = window.__wxConfig.pages[0];
    }

    if (tabList.includes(newPath) && !this.showTabBar) {
      this.show();
    } else if (!tabList.includes(newPath) && this.showTabBar) {
      this.hide();
    }
  }
}

export default App;
