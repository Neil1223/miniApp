import Base from '@/webview/mixin/base';
import Hover from '@/webview/mixin/hover';
import template from './template.html';

class View extends Hover(Base) {
  static is = 'wx-view';
  static template = template;
  constructor() {
    super();
  }
}

export default View;
