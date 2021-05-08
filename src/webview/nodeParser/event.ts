import { publishPageEvent } from '../bridge';

const EventNames = ['tap', 'longtap'];
const PRESS_DELAY = 350; // 手指触摸后，超过 350ms 再离开, longtap事件
const TAP_DISTANCE = 5; // tap事件的移动距离需要小于5px

const addTapEvent = (element: HTMLElement) => {
  let timer: any;
  let firstPosition: any;

  const touchstart = (e: TouchEvent) => {
    firstPosition = { x: e.touches[0].pageX, y: e.touches[0].pageY };
    timer && clearTimeout(timer);
    // 超过350ms，触发长按事件
    timer = setTimeout(() => {
      timer = null;
      // 需要再这里设置一下回调函数，然后改变isLongTap的状态
      const event: any = new Event('wx-longpress', { bubbles: true, composed: true });
      event.detail = firstPosition;
      element.dispatchEvent(event);
    }, PRESS_DELAY);
  };

  const touchmove = (e: TouchEvent) => {
    // 当出现滑动的时候，需要移除监听，以免造成长按事件
    const distanceX = Math.abs(e.changedTouches[0].pageX - firstPosition.x);
    const distanceY = Math.abs(e.changedTouches[0].pageY - firstPosition.y);
    if (distanceX > TAP_DISTANCE || distanceY > TAP_DISTANCE) {
      timer && clearTimeout(timer);
    }
  };

  const touchend = (e: TouchEvent) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      const distanceX = Math.abs(e.changedTouches[0].pageX - firstPosition.x);
      const distanceY = Math.abs(e.changedTouches[0].pageY - firstPosition.y);
      if (!(distanceX > TAP_DISTANCE || distanceY > TAP_DISTANCE)) {
        const event: any = new Event('wx-tap', { bubbles: true, composed: true });
        event.detail = { x: e.changedTouches[0].pageX, y: e.changedTouches[0].pageY, sourceEndEvent: e };
        element.dispatchEvent(event);
      }
    }
  };

  element.addEventListener('touchstart', touchstart);
  element.addEventListener('touchmove', touchmove);
  element.addEventListener('touchend', touchend);
  element.addEventListener('touchcancel', touchend);
};

export const addListener = (element: HTMLElement, eventName: string, callback: Function) => {
  // 需要设置一个 __hasTapEvent 属性，用于判断当前元素是否已经绑定了tap事件，如果已经绑定了，那么就不需要再调用addTapEvent方法
  switch (eventName) {
    case 'tap':
      if (!element.__hasTapEvent) {
        element.__hasTapEvent = true;
        addTapEvent(element);
      }
      element.addEventListener('wx-tap', (e: any) => {
        callback.call(element, {
          touches: e.detail.sourceEndEvent.changedTouches,
          changedTouches: e.detail.sourceEndEvent.changedTouches,
          detail: { x: e.detail.x, y: e.detail.y },
          target: e.detail.sourceEndEvent.target,
          timeStamp: e.timeStamp,
        });
      });
      break;
    case 'longtap':
      if (!element.__hasTapEvent) {
        element.__hasTapEvent = true;
        addTapEvent(element);
      }
      element.addEventListener('wx-longpress', (e: any) => {
        callback.call(element, e);
      });
      break;
  }
};

export const applyEvent = (element: HTMLElement, key: string, eventHandleName: string) => {
  const eventNames = /(bind|catch):?(.+)/.exec(key);
  if (eventNames && EventNames.includes(eventNames[2])) {
    const eventName = eventNames[2];
    addListener(element, eventName, (res: any) => {
      publishPageEvent(eventHandleName, res, 1);
    });
  }
};
