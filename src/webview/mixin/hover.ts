/**
 * 仅供 Button,View,Navigator 使用，提供 hover-class 效果
 */
// 如何让上一层的 properties，覆盖这一层的 properties
// 如何让properties 挂载到this上
const Hover = (Base: typeof HTMLElement) => {
  class Hover extends Base {
    private hovering = false;
    private _hoverTouch = false;
    private _hoverStartTimer: any;
    __data = {};
    static properties = {
      hoverClass: { type: String, value: 'none' },
      hoverStopPropagation: { type: Boolean, value: false },
      hoverStartTime: { type: Number, value: 50 }, // hover 延时生效事件
      hoverStayTime: { type: Number, value: 400 }, // hover 效果，延时消失时间
    };
    constructor() {
      super();
      this._bindHover();
      const curClass = this.constructor as any;
      for (const key in curClass.properties) {
        // 通过 Object.defineProperty 进行属性值的复制
        this.__data[key] = curClass.properties[key].value;
        if (!this[key]) {
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
    private _bindHover = () => {
      this.addEventListener('touchstart', this._hoverTouchStart.bind(this));
      this.addEventListener('touchend', this._hoverTouchEnd.bind(this));
      this.addEventListener('touchcancel', this._hoverCancel.bind(this));
      this.addEventListener('touchmove', this._hoverCancel.bind(this)); // move事件的时候，移除hover效果
    };
    private _unbindHover = () => {
      this.removeEventListener('touchstart', this._hoverTouchStart.bind(this));
      this.removeEventListener('touchend', this._hoverTouchEnd.bind(this));
      this.removeEventListener('touchcancel', this._hoverCancel.bind(this));
      this.removeEventListener('touchmove', this._hoverCancel.bind(this));
    };
    private _hoverTouchStart = () => {
      if (!this.hoverClass || this.hoverClass === 'none' || this.disabled) {
        return;
      }
      this._hoverTouch = true;
      this._hoverStartTimer = setTimeout(() => {
        this.hovering = true;
        this.setAttribute('class', this.hoverClass);
        if (!this._hoverTouch) {
          // 防止在 hoverStartTime 时间内触发了 touchend,touchcancel,touchmove
          this._hoverReset();
        }
      }, this.hoverStartTime);
    };
    private _hoverTouchEnd = () => {
      this._hoverTouch = false;
      if (this.hovering) {
        this._unbindHover();
        this._hoverReset();
      }
    };
    private _hoverCancel = () => {
      this._hoverTouch = false;
      // cancel 的时候，直接移除 hover 效果
      this.hovering = false;
      clearTimeout(this._hoverStartTimer);
      this.classList.toggle(this.hoverClass, false);
    };
    private _hoverReset = () => {
      requestAnimationFrame(() => {
        clearTimeout(this._hoverStartTimer);
        this._hoverStartTimer = setTimeout(() => {
          this.hovering = false;
          this.classList.toggle(this.hoverClass, false);
        }, this.hoverStayTime);
      });
    };
  }

  return Hover;
};

export default Hover;
