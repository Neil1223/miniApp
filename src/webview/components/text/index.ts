import Base from '@/webview/mixin/base';
import Hover from '@/webview/mixin/hover';
import template from './template.html';

class Text extends Hover(Base) {
  static is = 'wx-text';
  static template = template;
  constructor() {
    super();
  }
  connectedCallback() {
    const splitCode: string[] = this.innerText.split('\\n');
    if (splitCode.length > 1) {
      splitCode.forEach((item, index) => {
        if (index === 0) {
          this.innerHTML = item;
        } else {
          this.appendChild(document.createTextNode(item));
        }

        if (index + 1 < splitCode.length) {
          this.appendChild(document.createElement('br'));
        }
      });
    }
  }
}

export default Text;
