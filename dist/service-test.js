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
    motto: 'Hello World'
  },
  bindViewTap: function bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    });
  },
  onLoad: function onLoad() {
    console.log('===============', app, data);
  }
});});
define("pages/logs/logs.js", function(require, module, exports, window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,WebSocket,webkit,ttJSCore,Reporter,print){"use strict";

Page({
  onLoad: function onLoad(e) {
    console.log('Page onLoad,二级页面', e);
  },
  onUnload: function onUnload() {
    console.log('二级页面触发销毁事件');
  },
  back: function back() {
    console.log('-手动触发back事件--');
    kiple.navigateBack();
  }
});});

require('app.js');
 initApp();