/**
 * 仅供 Button,View,Navigator 使用，提供 hover-class 效果
 */
export default class Hover extends HTMLElement {
  private hovering = false;
  private _hoverTouch = false;
  private _hoverStartTimer: any;
  hoverProps = {
    hoverClass: 'none',
    hoverStopPropagation: false,
    hoverStartTime: 50, // hover 延时生效事件
    hoverStayTime: 400, // hover 效果，延时消失时间
  };
  constructor() {
    super();
    this.bindHover();
  }
  private bindHover = () => {
    this.addEventListener('touchstart', this.hoverTouchStart.bind(this));
    this.addEventListener('touchend', this.hoverTouchEnd.bind(this));
    this.addEventListener('touchcancel', this.hoverCancel.bind(this));
    this.addEventListener('touchmove', this.hoverCancel.bind(this)); // move事件的时候，移除hover效果
  };
  private unbindHover = () => {
    this.removeEventListener('touchstart', this.hoverTouchStart.bind(this));
    this.removeEventListener('touchend', this.hoverTouchEnd.bind(this));
    this.removeEventListener('touchcancel', this.hoverCancel.bind(this));
    this.removeEventListener('touchmove', this.hoverCancel.bind(this));
  };
  private hoverTouchStart = () => {
    if (!this.hoverProps.hoverClass || this.hoverProps.hoverClass === 'none' || this.disabled) {
      return;
    }
    this._hoverTouch = true;
    this._hoverStartTimer = setTimeout(() => {
      this.hovering = true;
      this.setAttribute('class', this.hoverProps.hoverClass);
      if (!this._hoverTouch) {
        // 防止在 hoverStartTime 时间内触发了 touchend,touchcancel,touchmove
        this.hoverReset();
      }
    }, this.hoverProps.hoverStartTime);
  };
  private hoverTouchEnd = () => {
    this._hoverTouch = false;
    if (this.hovering) {
      this.unbindHover();
      this.hoverReset();
    }
  };
  private hoverCancel = () => {
    this._hoverTouch = false;
    // cancel 的时候，直接移除 hover 效果
    this.hovering = false;
    clearTimeout(this._hoverStartTimer);
    this.classList.toggle(this.hoverProps.hoverClass, false);
  };
  private hoverReset = () => {
    requestAnimationFrame(() => {
      clearTimeout(this._hoverStartTimer);
      this._hoverStartTimer = setTimeout(() => {
        this.hovering = false;
        this.classList.toggle(this.hoverProps.hoverClass, false);
      }, this.hoverProps.hoverStayTime);
    });
  };
}
