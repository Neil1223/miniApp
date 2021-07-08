import Base from '@/webview/mixin/base';
import Hover from '@/webview/mixin/hover';
import template from './template.html';

class Text extends Hover(Base) {
  static is = 'wx-text';
  static template = template;
  constructor() {
    super();
  }
}

export default Text;
