import Property from './property';

/**
 * 仅供基础的组件模板,所有组件都可以基于Base进行创建
 */
const BaseWrapper = (Parent: typeof HTMLElement) => {
  class Base extends Parent {
    static is = 'wx-base';
    static get properties() {
      return {
        hidden: { type: Boolean, reflectToAttribute: true },
      };
    }
    constructor() {
      super();
      // 开启 attachShadow
      const shadowRoot = this.attachShadow({ mode: 'open' });
      // 创建模板
      const templateNode = document.createElement('template');
      templateNode.innerHTML = (this.constructor as any).template;
      shadowRoot.appendChild(templateNode.content.cloneNode(true));
    }

    triggerEvent(eventName: string, detail: any = {}) {
      const event: any = new Event(eventName, { bubbles: false, composed: false });
      event.detail = detail;
      this.dispatchEvent(event);
    }
  }

  return Base;
};

const Base = BaseWrapper(Property(HTMLElement));

export default Base;
