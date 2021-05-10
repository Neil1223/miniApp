/**
 * 将组件中properties绑定到组件实例中，并提供变化的监听
 */
const Property = (Base: typeof HTMLElement) => {
  const getParentInstance = (e: Object) => {
    const parent = Object.getPrototypeOf(e);
    return parent.prototype instanceof Property ? parent : null;
  };
  class Property extends Base {
    constructor() {
      super();
      console.log('===初始化=Property=');
      this._initializeProperties();
    }
    __data = {};
    private _initializeProperties() {
      // init parent props.
      (this.constructor as any).finalize();
      // init current props.
      const curClass: any = this.constructor;
      curClass.createProperties(curClass.properties);
    }
    static finalize() {
      // 注册parent的属性
      const parent = getParentInstance(this); // 获取父及的原型
      if (parent) {
        parent.properties && this.createProperties(parent.properties);
        parent.finalize();
      }
    }
    static createProperties(props: { [key: string]: any }) {
      console.log('===========注册属性start==================', props);
      for (var key in props) {
        this.prototype.addProps(key, props[key].value);
      }
      console.log('===========注册属性end==================');
    }
    addProps(key: string, value: any) {
      if (this.hasOwnProperty(key)) {
        return;
      }
      this.__data[key] = value;
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
  return Property;
};

export default Property;
