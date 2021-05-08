import { render } from '../nodeParser/render';

export default function initSubscribe(subscribe: ViewJSBridge['subscribe']) {
  subscribe('pageScrollTo', (e: any) => {
    console.log('通过api触发页面返回顶部', e);
  });
  subscribe('renderPage', (pageData: any, path: string) => {
    console.log('开始渲染页面', pageData);
    render(window.app[path].render(pageData), document.querySelector('#app'));
  });
  subscribe('reRenderPage', (pageData: any, path: string) => {
    console.log('开始渲染页面', pageData);
    // 先进行硬编码，将页面渲染一下，后面在调整
    const parentEl = document.querySelector('#app');
    parentEl?.removeChild(parentEl.children[0]);
    render(window.app[path].render(pageData), parentEl);
  });
}
