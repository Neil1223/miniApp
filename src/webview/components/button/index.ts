import Hover from '@/webview/mixin/hover';
import Property from '@/webview/mixin/property';
import template from './index.tpl';

const PolymerElement = Property(HTMLElement);

class Button extends Hover(PolymerElement) {
  static get is() {
    return 'wx-button';
  }
  static get properties() {
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
  constructor() {
    super();
    console.log('render-Button', Button.properties);
    const shadowRoot = this.attachShadow({ mode: 'open' });
    // 创建模板
    const templateNode = document.createElement('template');
    templateNode.innerHTML = template;
    shadowRoot.appendChild(templateNode.content.cloneNode(true));
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
