import { getCurrentPages } from '@/core/page';

interface PageEvent {
  eventName: string;
  data: Object;
}

const onWebviewEvent = (args: PageEvent, pageId: number) => {
  console.log(`Invoke event ${args.eventName} in page: ${pageId}`);
  const pages = getCurrentPages();
  const curPage = pages.find((item) => item.__webviewId__ === pageId);
  if (curPage) {
    curPage[args.eventName] && curPage[args.eventName].call(curPage, args.data);
  }
};

export default function initSubscribe(subscribe: ServiceJSBridge['subscribe']) {
  subscribe('PAGE_EVENT', onWebviewEvent);
}
