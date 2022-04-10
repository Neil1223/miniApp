import { getCurrentPages, registerPage } from '@/core/service/page';
import { onAppRoute } from 'kiple-platform/service/api/route';
import { registerComponent } from '@/core/service/page/component';

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
  subscribe('registerPage', (args: { route: string; query: object }, pageId: number) => {
    registerPage(args.route, pageId, args.query);
  });

  // 监听到注册组件
  subscribe('registerComponent', registerComponent);

  // 监听 view 层触发的路由跳转事件,一般是tab切换，或者是直接进入某个页面
  subscribe('onRouteChange', (args: { type: string; options: any }) => {
    onAppRoute(args.type, args.options);
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
