import Button from './button/index';

const components = [Button];

const registerAllElement = () => {
  // 需要获取当前文件夹里面的所有导出文件，然后循环遍历绑定到window对象上
  components.forEach((component) => {
    if (component.is) {
      window.customElements.define(component.is, component);
    }
  });
};

export default registerAllElement;
