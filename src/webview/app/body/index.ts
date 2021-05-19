import Base from '@/webview/mixin/base';
import template from './template.html';

class Body extends Base {
  static is = 'wx-page-body';
  static template = template;
  constructor() {
    super();
  }
}

export default Body;
