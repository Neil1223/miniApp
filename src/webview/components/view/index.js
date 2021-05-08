import template from '../button/index.tpl';
import './template.css';

class View {
  constructor() {
    console.log('----------------', this.template());
  }
  template = () => {
    return template;
  };
  init = () => {}; // 初始化組件
  computed = () => {}; // 组件加载到页面触发事件
  properties = () => {}; // 组件的各属性
  listeners = {};
}

console.log(template, '===');

new View();

window.ss = View;

export default View;
