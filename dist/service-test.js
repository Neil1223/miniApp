define("pages/index/data.js", function(require, module, exports, window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,WebSocket,webkit,ttJSCore,Reporter,print){"use strict";

module.exports = ['transform'];});
define("pages/index/index.js", function(require, module, exports, window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,WebSocket,webkit,ttJSCore,Reporter,print){"use strict";

var data = require('./data');

var app = getApp();

var sum = function sum(a, b) {
  return a + b;
};

console.log(sum(1, 2));
Page({
  data: {
    motto: 'Hello World',
    user: {
      name: 'Neil'
    },
    count: 10,
    length: 3,
    name: 'Neil'
  },
  onLoad: function onLoad() {
    console.log('===============', app, data);
  },
  bindViewTap: function bindViewTap() {
    kiple.navigateTo({
      url: 'pages/logs/logs'
    });
  },
  onHide: function onShow() {
    console.log('Page onHide');
  },
  onPageScroll: function onPageScroll(e) {
    console.log('========监听到页面的滚动事件', e);
  },
  onPullDownRefresh: function onPullDownRefresh() {
    console.log('触发下拉刷新');
    setTimeout(function () {
      kiple.stopPullDownRefresh();
    }, 2000);
  },
  onReachBottom: function onReachBottom(e) {
    console.log('触发加载更多....', e);
  },
  addFunc: function addFunc() {
    this.setData({
      count: ++this.data.count
    });
  },
  subFunc: function subFunc() {
    this.setData({
      count: --this.data.count
    });
  },
  open2: function open2() {
    kiple.navigateTo({
      url: 'pages/custom',
      fail: function fail(e) {
        console.log('===', e);
      }
    });
  },
  open: function open() {
    kiple.navigateTo({
      url: 'pages/second',
      fail: function fail(e) {
        console.log('===', e);
      }
    });
  }
});});
define("pages/logs/logs.js", function(require, module, exports, window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,WebSocket,webkit,ttJSCore,Reporter,print){"use strict";

Page({
  onLoad: function onLoad(e) {
    console.log('Page onLoad,二级页面', e);
    console.log(require('../index/data'));
  },
  onUnload: function onUnload() {
    console.log('二级页面触发销毁事件');
  },
  back: function back() {
    console.log('-手动触发back事件--');
    kiple.navigateBack();
  }
});});
define("app.js", function(require, module, exports, window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,WebSocket,webkit,ttJSCore,Reporter,print){"use strict";

App({
  globalData: {},
  onLaunch: function onLaunch() {
    console.log('onLaunch');
  }
});});

require('app.js');
 initApp();