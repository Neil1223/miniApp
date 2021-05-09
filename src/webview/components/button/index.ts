import Hover from '@/webview/mixin/hover';
import template from './index.tpl';

class Button extends Hover(HTMLElement) {
  static componentName = 'wx-button';
  static properties = {
    type: { type: String, value: 'default' },
    size: { type: String, value: 'default' },
    disabled: { type: Boolean, value: false },
    plain: { type: Boolean, value: false },
    loading: { type: Boolean, value: false },
    formType: { type: String, value: '' },
    openType: { type: String, value: '' },
    hoverStartTime: { type: Number, value: 20 },
    hoverStayTime: { type: Number, value: 70 },
    hoverClass: { type: String, value: 'button-hover' },
  };
  constructor() {
    super();
    console.log('render-Button');
    const shadowRoot = this.attachShadow({ mode: 'open' });
    // 创建模板
    const templateNode = document.createElement('template');
    templateNode.innerHTML = template;
    shadowRoot.appendChild(templateNode.content.cloneNode(true));
    // 设置属性
    const curClass = this.constructor as any;
    for (const key in curClass.properties) {
      // 通过 Object.defineProperty 进行属性值的复制
      this.__data[key] = curClass.properties[key].value;
      if (!this.hasOwnProperty(key)) {
        Object.defineProperty(this, key, {
          get: function () {
            return this.getAttribute(key) || this.__data[key];
          },
          set: (e) => {
            this.setAttribute(key, e);
          },
        });
      }
    }
  }
  connectedCallback() {
    console.log('button init');
  }
  disconnectedCallback() {
    console.log('移除元素');
  }
  static get observedAttributes() {
    return ['type'];
  }
  attributeChangedCallback(name: string, oldValue: any, newValue: any) {
    console.log('==type change==', name, oldValue, newValue);
  }
}

export default Button;
