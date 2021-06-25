//react-dom/patch.js
import { setProperty, createDomTree } from '../render';
import { IPatch, IPatches } from './diff';
import { PATCHES_TYPE } from './patches-type';

interface IPatchHelper {
  Index: number;
}

export function patch(node: Node, patches: IPatches, hash?: string) {
  let patchHelper: IPatchHelper = {
    Index: 0,
  };
  setPatch(node, patches, patchHelper, hash);
}

function setPatch(node: Node, patches: IPatches, patchHelper: IPatchHelper, hash?: string) {
  let currentPatch = patches[patchHelper.Index];
  if (currentPatch) {
    doPatch(node, currentPatch, hash);
  }
  // 当元素是移除或者替换的时候，就不需要遍历老的元素了，因为都是已经删除了的
  if (currentPatch && [PATCHES_TYPE.REPLACE, PATCHES_TYPE.REMOVE].includes(currentPatch[0].type)) {
    return;
  }

  let length = node.childNodes.length;
  if (currentPatch && currentPatch[0].type === PATCHES_TYPE.ADD && currentPatch[0].nodeList) {
    // 如果是 add，那么需要减去增加的长度，以免循环时 Index 发生变化，导致后面的其他节点不能正确的匹配到
    length -= currentPatch[0].nodeList.length;
  }

  for (let index = 0; index < length; index++) {
    const child = node.childNodes[index];
    if (!child) {
      return;
    }
    patchHelper.Index++;

    // 如果某个子节点被删除，那么本应该是下一个节点进入循环，此时就变成了下下各节点了，中间的那个节点就被跳过了，需要将这个节点插入到循环中
    if (patches[patchHelper.Index] && patches[patchHelper.Index][0].type === PATCHES_TYPE.REMOVE) {
      index--;
    }
    setPatch(child, patches, patchHelper, hash);
  }
}

const doPatch = (node: Node, patches: IPatch[], hash?: string) => {
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
        if (patch.node || patch.node === null) {
          const newNode = createDomTree(patch.node, hash);
          newNode && node.parentNode?.replaceChild(newNode, node);
        }
        break;
      case PATCHES_TYPE.REMOVE:
        node.parentNode?.removeChild(node);
        break;
      case PATCHES_TYPE.ADD:
        patch.nodeList &&
          patch.nodeList.forEach((nodeChild: IVirtualDom) => {
            const newNode = createDomTree(nodeChild, hash);
            newNode && node.appendChild(newNode);
          });
        break;
      default:
        break;
    }
  });
};
