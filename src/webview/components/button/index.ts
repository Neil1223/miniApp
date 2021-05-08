import Hover from '@/webview/mixin/hover';
import template from './index.tpl';

class Button extends Hover {
  static get componentName() {
    return 'wx-button';
  }
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    // 创建模板
    const templateNode = document.createElement('template');
    templateNode.innerHTML = template;
    shadowRoot.appendChild(templateNode.content.cloneNode(true));
    const ss = this.properties();
    Object.keys(ss).forEach((e) => {
      if (this.hoverProps[e]) {
        this.hoverProps[e] = ss[e].value;
      }
      if (e === 'disabled') {
        console.log('====', ss[e].value);
      }

      this[e] = ss[e].value;
    });
  }
  connectedCallback() {
    const defaultValue = this.getAttribute('disabled');
    console.log('=init==', defaultValue);
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
  properties() {
    return {
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
  }
}

export default Button;
