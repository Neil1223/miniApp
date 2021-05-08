/**
 * 为组件提供事件监听功能
 */
export default class listener extends HTMLElement {
  constructor() {
    super();
    this._addListeners();
  }
  disconnectedCallback() {
    this._removeListeners();
  }
  private _addListeners = () => {
    this.addEventListener('touchstart', () => {
      console.log('============');
    });
    console.log('添加监听效果');
  };
  private _removeListeners = () => {
    console.log('移除监听效果');
  };
}
