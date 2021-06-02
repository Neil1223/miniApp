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

var data = require('../index/data');

Page({
  data: {
    logs: []
  },
  onLoad: function onLoad() {
    console.log('00000000000', data);
  }
});});

require('app.js');
 initApp();