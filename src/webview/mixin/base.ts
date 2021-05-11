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
    }
  }

  return Base;
};

const Base = BaseWrapper(Property(HTMLElement));

export default Base;
