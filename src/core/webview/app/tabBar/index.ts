import { publishPageEvent } from '@/core/webview/bridge';
import Base from '@/core/webview/mixin/base';
import { createElement as _h, render } from '@/core/webview/parser/render';
import { PageFactory } from '@/core/webview/page';
import template from './template.html';
import { history } from '@/core/webview/page/route';

class App extends Base {
  static is = 'wx-tabbar';
  static template = template;
  showTabBar = false;
  selectedIndex = 0;
  constructor() {
    super();
    // 创建元素
    this._createChild();
  }
  connectedCallback() {
    // 初次触发active
    this._onRouteChange(location.pathname);

    // 处理路由的监听
    history.listen(({ location }) => {
      console.log('newURL:', location.pathname);
      this._onRouteChange(location.pathname);
    });
  }
  _createChild() {
    const { list, borderStyle, backgroundColor, color } = window.__wxConfig.tabBar;

    // 创建子元素（元素是未选中状态）
    const items = list.map((item, index) => {
      const hasIcon = item.iconPath && item.selectedIconPath ? true : false;
      const fontSize = hasIcon ? '12px' : '16px';
      return _h(
        'div',
        {
          className: 'uni-tabbar__item',
          onClick: () => this._switchTab(item, index),
        },
        hasIcon ? _h('div', { className: 'uni-tabbar__item-icon' }, _h('img', { src: '/' + item.iconPath })) : null,
        _h('div', { style: { color, fontSize }, className: 'uni-tabbar__item-text' }, item.text)
      );
    });

    // 创建border
    const borderView = _h('div', {
      className: 'uni-tabbar__border',
      style: { backgroundColor: borderStyle === 'white' ? 'rgba(255, 255, 255, 0.33)' : 'rgba(0, 0, 0, 0.33)' },
    });

    // 创建父元素
    render(_h('div', { className: 'uni-tabbar', style: { backgroundColor } }, borderView, ...items), (this as any).shadowRoot);
  }
  _show() {
    this.showTabBar = true;
    this.style.display = 'block';
    (this.parentElement as HTMLElement).classList.toggle('uni-showTabbar', true);
  }
  _hide() {
    this.showTabBar = false;
    this.style.display = 'none';
    (this.parentElement as HTMLElement).classList.toggle('uni-showTabbar', false);
  }
  /**
   * 触发 item 的点击事件
   */
  _switchTab({ pagePath, text }: { pagePath: string; text: string }, index: number) {
    let curPathname = location.pathname;
    if (curPathname && curPathname[0] === '/') {
      curPathname = curPathname.replace('/', '');
    }
    if (pagePath !== curPathname) {
      KipleViewJSBridge.publishHandler('onRouteChange', { type: 'switchTab', options: { url: pagePath } }, 0);
    } else {
      // 向 Service 发送 onTabItemTap 事件
      const detail = { index, text, pagePath };
      publishPageEvent('onTabItemTap', detail, PageFactory.getCurrentWebviewId());
    }
  }
  /**
   * 路由改变时，修改 item 的文字样式，图片地址
   */
  _changeActive(index: number) {
    const tabItems = (this as any).shadowRoot.querySelectorAll('.uni-tabbar__item .uni-tabbar__item-text');
    const activeItem = (this as any).shadowRoot.querySelector('.uni-tabbar__item.active .uni-tabbar__item-text');
    const { color, selectedColor } = window.__wxConfig.tabBar;
    if (activeItem) {
      activeItem.style.color = color;
      activeItem.parentElement.classList.toggle('active', false);
      const tabItemConfig = window.__wxConfig.tabBar.list[this.selectedIndex];
      if (tabItemConfig && tabItemConfig.iconPath && tabItemConfig.selectedIconPath) {
        const tabIcon = tabItems[this.selectedIndex].parentElement.querySelector('img') as HTMLElement;
        tabIcon.setAttribute('src', `/${tabItemConfig.iconPath}`);
      }
    }
    tabItems[index].style.color = selectedColor;
    tabItems[index].parentElement.classList.toggle('active', true);
    const tabItemConfig = window.__wxConfig.tabBar.list[index];
    if (tabItemConfig.iconPath && tabItemConfig.selectedIconPath) {
      const tabIcon = tabItems[index].parentElement.querySelector('img') as HTMLElement;
      tabIcon.setAttribute('src', `/${tabItemConfig.selectedIconPath}`);
    }
  }
  /**
   * 路由改变时，决定tabbar显示或是隐藏，同时决定哪个tab高亮
   */
  _onRouteChange(newURL?: string, oldURL?: string) {
    const tabList = window.__wxConfig.tabBar.list.map((item) => item.pagePath);
    if (newURL && newURL[0] === '/') {
      newURL = newURL.replace('/', '');
    }
    if (!newURL) {
      newURL = window.__wxConfig.pages[0];
    }

    const index = tabList.findIndex((item) => item === newURL);

    if (index !== -1) {
      this._changeActive(index);
      this.selectedIndex = index;
    }

    if (index !== -1 && !this.showTabBar) {
      this._show();
    } else if (index === -1 && this.showTabBar) {
      this._hide();
    }
  }
}

export default App;
