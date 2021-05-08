import { isFn, isStr } from '@/util';
import { applyEvent } from './event';
import { CreateIVirtualDomFunc, IVirtualDom } from './render.d';

/**
 * 设置组件的属性，绑定事件监听
 * @param dom {HTMLElement} DOM节点
 * @param key {string} 属性名
 * @param value {any} 属性值
 */
const setProperty = (dom: HTMLElement, key: string, value: any) => {
  if (/(bind|catch):?(.+)/.test(key)) {
    applyEvent(dom, key, value);
  } else if (key == 'style' && value) {
    // TODO style 属性需要进行 rpx2px 的转换
    if (isStr(value)) {
      dom.style.cssText = value;
    }
  } else if (value) {
    dom.setAttribute(key, value);
  }
};

/**
 * 根据虚拟dom，生成真实dom
 * @param virtualDom 虚拟DOM树
 */
const createDom = (virtualDom: IVirtualDom): HTMLElement | Text | null => {
  if (virtualDom && isStr(virtualDom.tag)) {
    const dom = document.createElement(virtualDom.tag as string);
    if (virtualDom.props) {
      for (let key in virtualDom.props) {
        setProperty(dom, key, virtualDom.props[key]);
      }
    }
    //递归处理子节点,将子节点插入到dom里面
    if (virtualDom.children && virtualDom.children.length > 0) {
      virtualDom.children.forEach((item) => render(item, dom));
    }
    return dom;
  } else if (virtualDom && isFn(virtualDom.tag)) {
    // 简单的处理函数组件，小程序只生成简单的函数组件，暂时不进行复杂的处理
    const _virtualDom = (virtualDom.tag as CreateIVirtualDomFunc)(virtualDom.props);
    const dom = createDom(_virtualDom);
    return dom;
  } else if (virtualDom && !virtualDom.tag) {
    return document.createTextNode(String(virtualDom));
  }
  return null;
};

/**
 * 根据虚拟dom，和父节点，渲染页面
 */
export const render = (virtualDom: IVirtualDom, container: HTMLElement) => {
  // 根据虚拟DOM转换为真实DOM
  const dom = createDom(virtualDom);
  // 将真实DOM添加到容器DOM中
  if (dom) {
    container.appendChild(dom);
  }
};

/**
 * 创建虚拟dom，所有的页面元素都需要调用这个方法
 */
export const createElement = (tag: string, props: any, ...children: any[]): IVirtualDom => {
  return { tag, props, children };
};

/**
 * 通过render函数和page的Data，生成虚拟dom(类似于react中的函数组件+props)
 * @param render {Function} 页面的渲染函数
 * @param data {Object} 页面的状态数据
 */
export const createVirtualDom = (render: Function, data: Object): IVirtualDom => {
  return render(data);
};
