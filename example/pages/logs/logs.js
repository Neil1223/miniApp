Page({
  onLoad(e) {
    console.log('Page onLoad,二级页面', e);
    console.log(require('../index/data'));
  },
  onUnload() {
    console.log('二级页面触发销毁事件');
  },
  back() {
    console.log('-手动触发back事件--');
    kiple.navigateBack();
  },
});
