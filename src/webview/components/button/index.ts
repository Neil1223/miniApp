import Base from '@/webview/mixin/base';
import Hover from '@/webview/mixin/hover';
import template from './index.tpl';

class Button extends Hover(Base) {
  static is = 'wx-button';
  static get properties(): any {
    return {
      type: { type: String, value: 'default', reflectToAttribute: true },
      size: { type: String, value: 'default', reflectToAttribute: true },
      disabled: { type: Boolean, value: false, reflectToAttribute: true },
      plain: { type: Boolean, value: false, reflectToAttribute: true },
      loading: { type: Boolean, value: false, reflectToAttribute: true },
      formType: { type: String, value: '' },
      openType: { type: String, value: '' },
      hoverStartTime: { type: Number, value: 20 },
      hoverStayTime: { type: Number, value: 70 },
      hoverClass: { type: String, value: 'button-hover', observer: '_hoverClassChange' },
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
}

export default Button;
