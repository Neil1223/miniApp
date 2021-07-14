import Base from '@/webview/mixin/base';
import Hover from '@/webview/mixin/hover';
import template from './template.html';

class Text extends Hover(Base) {
  static is = 'wx-text';
  static template = template;
  constructor() {
    super();
  }

  connectedCallback() {
    this._initContent();
    // 需要监听 dom 发生变化，之所以有问题，是因为 diff 的时候，text 的children 是一个数组，文字变成了一个数组，导致index变化
    const config = { attributes: false, childList: true, subtree: true, characterData: true };
    // 创建一个观察器实例并传入回调函数
    (this as any)._observer = new MutationObserver(this.updateText.bind(this));
    (this as any)._observer.observe(this, config);
    console.log(this.shadowRoot as any, this);
  }

  disconnectedCallback() {
    (this as any)._observer && (this as any)._observer.disconnect();
  }

  compilerText(text: string) {
    const splitCode: string[] = text.replace(/\\n/g, '\n').split('\n');
    const container = document.createElement('span');
    splitCode.forEach((item, index) => {
      container.appendChild(document.createTextNode(item));
      if (index + 1 < splitCode.length) {
        container.appendChild(document.createElement('br'));
      }
    });
    return container;
  }

  _initContent() {
    const syncDom = document.createDocumentFragment();
    Array.from(this.childNodes).forEach((item) => {
      if (item.nodeType === 3) {
        // node 节点是 text
        syncDom.appendChild(this.compilerText(item.textContent || ''));
      } else if (item.nodeType === 1 && item.nodeName === 'WX-TEXT') {
        // node 节点是 element
        syncDom.appendChild(item);
      }
    });
    this.innerHTML = '';
    this.appendChild(syncDom); // 当自己appendChild,会触发 Mutation 事件
  }

  updateText(events?: any) {
    const event = events ? events[0] : null;
    if (event && event.type === 'childList' && event.target && event.target.tagName === 'SPAN') {
      if (event.addedNodes[0]?.textContent !== event.removedNodes[0]?.textContent) {
        const newNode = this.compilerText(event.target.textContent || '');
        event.target.parentNode.replaceChild(newNode, event.target);
        return;
      }
    }
  }
}

export default Text;
