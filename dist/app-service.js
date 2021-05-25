define("data.js",function(require, module, exports){
  'use strict';
  
  module.exports = {
    count:12,
  }
});
define("app.js", function(require, module, exports, window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,WebSocket,webkit,ttJSCore,Reporter,print){
  'use strict';
 
  const data = require('./data.js')
 App({
   onLaunch: function onLaunch() {
     console.log('App Launch');
   },
   onShow: function onShow() {
     console.log('App Show');
   },
   onHide: function onHide() {
     console.log('App Hide');
   },
   globalData: {
     imageUrl: 'https://sf3-ttcdn-tos.pstatp.com/obj/developer/ide/demo/',
     data: data
   }
 });
});

define("pages/index.js", function(require, module, exports, window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,WebSocket,webkit,ttJSCore,Reporter,print){
  "use strict";
 
 Page({
   data: {
     count: 10
   },
   onLoad: function onLoad() {
    console.log('Page onLoad');
   },
   onShow: function onShow(){
     console.log('Page onShow');
   },
   onHide: function onShow(){
     console.log('Page onHide');
   },
   onPageScroll(e){
     console.log('========监听到页面的滚动事件', e);
   },
   onPullDownRefresh(){
     console.log('触发下拉刷新')
     setTimeout(function () {
        kiple.stopPullDownRefresh();
     }, 2000);
   },
   onReachBottom(e){
     console.log('触发加载更多....',e)
   },
   addFunc() {
    this.setData({ count: ++this.data.count });
   },
   subFunc() {
    this.setData({ count: --this.data.count });
   },
   open(){
    kiple.navigateTo({url:'pages/second',fail(e){console.log('===',e)}});
   }
 });
});

define("pages/second.js", function(require, module, exports, window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,WebSocket,webkit,ttJSCore,Reporter,print){
  "use strict";
 
 Page({
   onLoad: function onLoad(e) {
    console.log('Page onLoad,二级页面', e);
   },
   onUnload(){
    console.log('二级页面触发销毁事件');
   },
   back() {
     console.log('-手动触发back事件--')
     kiple.navigateBack()
   },
 });
});

require('app.js'); // 启动App
initApp();