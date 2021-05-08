// 需要初始化一些需要监听的事件，当监听到

import { emit, on } from '@/util/customEvent';
import initSubscribe from './subscribe';

/**
 * 向 Service 层发送事件
 * @param event
 * @param args
 * @param pageId
 */
export const publishHandler = (event: string, args: any, pageId: number) => {
  window.viewJSBridge && window.viewJSBridge.subscribeHandler(event, args, pageId);
};

/**
 * 接收 View 层事件
 * @param event
 * @param args
 * @param pageId
 */
export const subscribeHandler = (event: string, args: any, pageId: number) => {
  console.log('接收到view层发送的事件', event, args, pageId);
  emit('view.' + event, args, pageId);
};

// 订阅事件，传递callback
export function subscribe(event: string, callback: EventListener) {
  return on('view.' + event, callback);
}

// 初始化需要订阅的函数
initSubscribe(subscribe);
