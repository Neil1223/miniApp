//react-dom/diff.js

import { PATCHES_TYPE } from './patches-type';

export interface IPatch {
  type: string;
  nodeList?: IVirtualDom[]; // 当子元素长度大于原来的时候，需要添加剩余的所有子集
  attrs?: { [key: string]: string }; // 属性发生变化
  text?: string; // 文字发生变化
  node?: IVirtualDom; // 原来节点和新的节点标签不一样
}

export interface IPatches {
  [key: number]: IPatch[];
}

export const isTextNode = (child: any): boolean => {
  return typeof child === 'object' && child.hasOwnProperty('tag') && child.hasOwnProperty('props') && child.hasOwnProperty('children') ? true : false;
};

const diffHelper = {
  Index: 0,
  diffAttr: (oldAttr: Object, newAttr: Object) => {
    let patches = {};
    for (let key in oldAttr) {
      if (oldAttr[key] !== newAttr[key]) {
        // 新的值和老的值不相等，此时需要将新的值赋值给 patches， 如果新值是删除了，那么传递 undefined 回去，也会导致老的属性发生删除
        patches[key] = newAttr[key];
      }
    }
    // 新增属性
    for (let key in newAttr) {
      if (!oldAttr.hasOwnProperty(key)) {
        patches[key] = newAttr[key];
      }
    }

    return patches;
  },
  diffChildren: (oldChild: IVirtualDom[], newChild: IVirtualDom[], patches: IPatches) => {
    if (newChild.length > oldChild.length) {
      // 有新节点产生
      patches[diffHelper.Index] = patches[diffHelper.Index] || [];
      patches[diffHelper.Index].push({
        type: PATCHES_TYPE.ADD,
        nodeList: newChild.slice(oldChild.length),
      });
    }
    oldChild.forEach((children, index) => {
      dfsWalk(children, newChild[index], ++diffHelper.Index, patches);
    });
  },
  dfsChildren: (oldChild: IVirtualDom) => {
    // 感觉没用呢？
    if (!isTextNode(oldChild)) {
      oldChild.children.forEach((children) => {
        ++diffHelper.Index;
        diffHelper.dfsChildren(children);
      });
    }
  },
};

// 这个方案是没有进行key的使用的 ！！！

export const diff = (oldTree: IVirtualDom, newTree: IVirtualDom) => {
  // 当前节点的标志 每次调用Diff，从0重新计数
  diffHelper.Index = 0;
  let patches: IPatches = {};

  // 进行深度优先遍历
  dfsWalk(oldTree, newTree, diffHelper.Index, patches);

  // 返回补丁对象
  return patches;
};

function dfsWalk(oldNode: IVirtualDom, newNode: IVirtualDom, index: number, patches: IPatches) {
  let currentPatches = [];
  if (!newNode) {
    // 如果不存在新节点，发生了移除，产生一个关于 Remove 的 patch 补丁
    currentPatches.push({
      type: PATCHES_TYPE.REMOVE,
    });

    // 删除了但依旧要遍历旧树的节点确保 Index 正确
    diffHelper.dfsChildren(oldNode);
  } else if (isTextNode(oldNode) && isTextNode(newNode)) {
    // 都是纯文本节点 如果内容不同，产生一个关于 textContent 的 patch
    if (oldNode !== newNode) {
      currentPatches.push({
        type: PATCHES_TYPE.TEXT,
        text: newNode,
      });
    }
  } else if (oldNode.tag === newNode.tag) {
    // 如果节点类型相同，比较属性差异，如若属性不同，产生一个关于属性的 patch 补丁
    let attrs = diffHelper.diffAttr(oldNode.props, newNode.props);

    // 有attr差异
    if (Object.keys(attrs).length > 0) {
      currentPatches.push({
        type: PATCHES_TYPE.ATTRS,
        attrs: attrs,
      });
    }

    // 如果存在孩子节点，处理孩子节点
    diffHelper.diffChildren(oldNode.children, newNode.children, patches);
  } else {
    // 如果节点类型不同，说明发生了替换
    currentPatches.push({
      type: PATCHES_TYPE.REPLACE,
      node: newNode,
    });
    // 替换了但依旧要遍历旧树的节点确保 Index 正确
    diffHelper.dfsChildren(oldNode);
  }

  // 如果当前节点存在补丁，则将该补丁信息填入传入的patches对象中
  if (currentPatches.length) {
    patches[index] = patches[index] ? patches[index].concat(currentPatches) : currentPatches;
  }
}
