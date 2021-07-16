import Base from '@/webview/mixin/base';
import Hover from '@/webview/mixin/hover';
import template from './template.html';

const SPACE_UNICODE = {
  ensp: '\u2002',
  emsp: '\u2003',
  nbsp: '\u00a0',
};

class Text extends Hover(Base) {
  static is = 'wx-text';
  static template = template;
  static get properties(): any {
    return {
      space: { type: String, value: '' },
      decode: { type: Boolean, value: false },
    };
  }
  constructor() {
    super();
  }

  connectedCallback() {
    this._initContent();
    // 需要监听 dom 发生变化，之所以有问题，是因为 diff 的时候，text 的children 是一个数组，文字变成了一个数组，导致index变化
    const config = { attributes: false, childList: true, subtree: true, characterData: true };
    // 创建一个观察器实例并传入回调函数
    (this as any)._observer = new MutationObserver(this._updateText.bind(this));
    (this as any)._observer.observe(this, config);
  }

  disconnectedCallback() {
    (this as any)._observer && (this as any)._observer.disconnect();
  }

  _decodeHtml(htmlString: string) {
    const { space, decode } = this as any;
    if (space && SPACE_UNICODE[space]) {
      htmlString = htmlString.replace(/ /g, SPACE_UNICODE[space]);
    }

    if (decode) {
      htmlString = htmlString
        .replace(/&nbsp;/g, SPACE_UNICODE.nbsp)
        .replace(/&ensp;/g, SPACE_UNICODE.ensp)
        .replace(/&emsp;/g, SPACE_UNICODE.emsp)
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
    }

    return htmlString;
  }

  _compilerText(text: string) {
    const splitCode: string[] = text.replace(/\\n/g, '\n').split('\n');
    const container = document.createElement('span');
    splitCode.forEach((item, index) => {
      container.appendChild(document.createTextNode(this._decodeHtml(item)));
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
        syncDom.appendChild(this._compilerText(item.textContent || ''));
        this.replaceChild(this._compilerText(item.textContent || ''), item);
      } else if (item.nodeType === 1 && item.nodeName !== 'WX-TEXT') {
        // node 节点是 element
        console.warn('<text> 组件内只支持嵌套 <text>，不支持其它组件或自定义组件。');
        this.removeChild(item);
      }
    });
  }

  _updateText(events?: any) {
    const event = events ? events[0] : null;
    if (event && event.type === 'childList' && event.target && event.target.tagName === 'SPAN') {
      if (event.addedNodes[0]?.textContent !== event.removedNodes[0]?.textContent) {
        const newNode = this._compilerText(event.target.textContent || '');
        event.target.parentNode.replaceChild(newNode, event.target);
        return;
      }
    }
  }
}

export default Text;
