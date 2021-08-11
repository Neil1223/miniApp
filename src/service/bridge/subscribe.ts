import { getCurrentPages, registerPage } from '@/service/core/page';
import { navigateBack, switchTab } from '../api/route';

interface PageEvent {
  eventName: string;
  data: Object;
}

const onWebviewEvent = (args: PageEvent, pageId: number) => {
  console.log(`Invoke event \`${args.eventName}\` in page: ${pageId}`);
  const pages = getCurrentPages();
  const curPage = pages.find((item) => item.__webviewId__ === pageId);
  if (curPage) {
    curPage[args.eventName] && curPage[args.eventName].call(curPage, args.data);
  }
};

export default function initSubscribe(subscribe: ServiceJSBridge['subscribe']) {
  // 监听到页面触发事件
  subscribe('PAGE_EVENT', onWebviewEvent);
  // 监听到注册页面
  subscribe('registerPage', (args: { route: string; query: Object }, pageId: number) => {
    registerPage(args.route, pageId, args.query);
  });
  // 监听到自定义header的back事件
  subscribe('navigateBack', () => {
    navigateBack();
  });
  // 监听到tab的点击切换事件
  subscribe('switchTab', (args: any) => {
    switchTab(args);
  });
  // app 进入后台
  subscribe('onAppEnterBackground', () => {
    KipleServiceJSBridge.emit('onAppEnterBackground');
  });
  // app 进入前台
  subscribe('onAppEnterForeground', () => {
    KipleServiceJSBridge.emit('onAppEnterForeground');
  });
}
