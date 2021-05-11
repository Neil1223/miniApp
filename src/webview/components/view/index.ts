import Base from '@/webview/mixin/base';
import Hover from '@/webview/mixin/hover';
import template from './index.tpl';

class View extends Hover(Base) {
  static is = 'wx-view';
  constructor() {
    super();
    console.log('render-View', View.properties);
    const shadowRoot = this.attachShadow({ mode: 'open' });
    // 创建模板
    const templateNode = document.createElement('template');
    templateNode.innerHTML = template;
    shadowRoot.appendChild(templateNode.content.cloneNode(true));
  }
  listeners = {};
}

export default View;
