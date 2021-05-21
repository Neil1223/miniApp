import { emit, on } from '@/util/customEvent';
import initSubscribe from './subscribe';

/**
 * 向 View 层发送事件(自定义事件)
 * @param event
 * @param args
 * @param pageId
 */
export const publishHandler = (event: string, args: any, pageId: number) => {
  window.serviceJSBridge && window.serviceJSBridge.subscribeHandler(event, args, pageId);
};

/**
 * 接收 Service 层事件(通常由 Service 层调用，并暴露至全局 UniServiceJSBridge 对象中)
 * @param event
 * @param args
 * @param pageId
 */
export const subscribeHandler = (event: string, args: any, pageId: number) => {
  console.log('接收到service层发送的事件', event, args, pageId);
  emit('service.' + event, args, pageId);
};

/**
 * 向 View 层发送Page事件(Page包裹的事件)
 * @param eventName
 * @param data
 * @param nodeId
 */
export const publishPageEvent = (eventName: string, data: any, nodeId: number) => {
  publishHandler('PAGE_EVENT', { eventName, data }, nodeId);
};

// 订阅事件，传递callback
export function subscribe(event: string, callback: EventListener) {
  return on('service.' + event, callback);
}

export { on, emit };

// 初始化需要订阅的函数
initSubscribe(subscribe);
