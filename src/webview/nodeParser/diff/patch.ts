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
  dfsPatch(node, patches, patchHelper);
}

function dfsPatch(node: Node, patches: IPatches, patchHelper: IPatchHelper) {
  let currentPatch = patches[patchHelper.Index];
  node.childNodes.forEach((child) => {
    patchHelper.Index++;
    dfsPatch(child, patches, patchHelper);
  });
  if (currentPatch) {
    doPatch(node, currentPatch);
  }
}

const doPatch = (node: Node, patches: IPatch[]) => {
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
        patch.text && (node.textContent = patch.text);
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
