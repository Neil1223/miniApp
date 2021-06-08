Page({
  onLoad(e) {
    console.log('Page onLoad,二级页面,传递的参数：', e);
    console.log(require('../index/data'));
  },
  onUnload() {
    console.log('二级页面触发销毁');
  },
  back() {
    console.log('-手动触发back事件--');
    kiple.navigateBack();
  },
});
