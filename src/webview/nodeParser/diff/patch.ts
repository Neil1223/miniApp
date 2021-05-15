//react-dom/patch.js
import { setProperty, createDomTree } from '../render';
import { IPatch, IPatches } from './diff';
import { PATCHES_TYPE } from './patches-type';

interface IPatchHelper {
  Index: number;
}

export function patch(node: Node, patches: IPatches) {
  let patchHelper: IPatchHelper = {
    Index: 0,
  };
  setPatch(node, patches, patchHelper);
}

function setPatch(node: Node, patches: IPatches, patchHelper: IPatchHelper) {
  let currentPatch = patches[patchHelper.Index];
  if (currentPatch) {
    doPatch(node, currentPatch);
  }
  // 当元素是移除或者替换的时候，就不需要遍历老的元素了，因为都是已经删除了的
  if (currentPatch && currentPatch[0].type === PATCHES_TYPE.REPLACE) {
    return;
  }
  node.childNodes.forEach((child) => {
    patchHelper.Index++;
    setPatch(child, patches, patchHelper);
  });
}

const doPatch = (node: Node, patches: IPatch[]) => {
  // 理论上 patches 应该只有一个子元素，因为 getPatches 中只会朝一个 Index 插入一条数据
  patches.forEach((patch) => {
    switch (patch.type) {
      case PATCHES_TYPE.ATTRS:
        for (let key in patch.attrs) {
          if (patch.attrs[key] !== undefined) {
            setProperty(node as HTMLElement, key, patch.attrs[key]);
          } else {
            (node as HTMLElement).removeAttribute(key);
          }
        }
        break;
      case PATCHES_TYPE.TEXT:
        patch.contentText && (node.textContent = patch.contentText);
        break;
      case PATCHES_TYPE.REPLACE:
        if (patch.node) {
          const newNode = createDomTree(patch.node);
          newNode && node.parentNode?.replaceChild(newNode, node);
        }
        break;
      case PATCHES_TYPE.REMOVE:
        node.parentNode?.removeChild(node);
        break;
      case PATCHES_TYPE.ADD:
        patch.nodeList &&
          patch.nodeList.forEach((nodeChild: IVirtualDom) => {
            const newNode = createDomTree(nodeChild);
            newNode && node.appendChild(newNode);
          });
        break;
      default:
        break;
    }
  });
};
