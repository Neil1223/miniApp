
var createElement = window.core.createElement;
var __AppCssCode__ = {};
  
  var PagesIndexIndex = (pageData) => {
    var count = pageData['count'];
var op = pageData['op'];
var user = pageData['user'];
var a = pageData['a'];
var b = pageData['b'];
var c = pageData['c'];
var length = pageData['length'];
var name = pageData['name'];

    return createElement('wx-view',{className:"container"},createElement('wx-h5',{className: count > 10 ? 'yes' : 'no' },"这里是page index页面"),createElement('wx-text',{hidden: true },"\"hello\" '测试{{}}表达式'"),createElement('wx-view',null,"count：",count," =》 ", count > 10 ? '大于10' : '小于等于10' ),createElement('wx-view',null, [1, 2, 3, 4, op] ),createElement('wx-view',null, user.name || count ),createElement('wx-view',null, a + b ," + ", c ," + d"),createElement('wx-view',null, length > 5 ),createElement('wx-view',null, 'hello' + name ),createElement('wx-button',{size:"mini",bindtap:"addFunc",bindlongtap:"subFunc"},"渲染button"),createElement('wx-button',{size:"mini",type:"primary",bindtap:"bindViewTap"},"跳转渐变页面"),createElement('wx-button',{size:"mini",type:"primary",bindtap:"open2"},"跳转无title页面"),createElement('wx-button',{size:"mini",type:"primary",bindtap:"bindViewTap"},"跳转LOG页面"),createElement('wx-view',{className:"a"},),createElement('wx-view',{className:"b"},),createElement('wx-view',{className:"c"},))
  };
  
  var PagesLogsLogs = (pageData) => {
    
    return createElement('wx-view',{className:"container log-list"},createElement('wx-img',{src:"https://hellouniapp.dcloud.net.cn/static/shuijiao.jpg",className:"img"},),createElement('wx-view',{className:"test"},"胡林Neil"),createElement('wx-button',{bindtap:"back"},"返回原来的页面"))
  };
  window.app = {"pages/index/index":{render: PagesIndexIndex},"pages/logs/logs":{render: PagesLogsLogs}}

const BASE_DEVICE_WIDTH = 750;
var deviceWidth = window.innerWidth || 375;

const rpx2px = (rpx) => {
  if (rpx === 0) {
    return 0;
  }
  rpx = (rpx / BASE_DEVICE_WIDTH) * deviceWidth;
  rpx = Math.floor(rpx);
  return rpx;
};

const setCssToHead = (word, path) => {
  return () => {
    var cssText = '';
    var style = document.createElement('style');
    var head = document.head || document.getElementsByTagName('head')[0];
    word.forEach(function (text) {
      if (typeof text === 'number') {
        cssText += rpx2px(text) + 'px';
      } else if (typeof text === 'string') {
        cssText += text;
      }
    });
    if (cssText) {
      style.setAttribute('path', path);
      style.appendChild(document.createTextNode(cssText));
      head.appendChild(style);
    }
  };
};
__AppCssCode__['pages/index/index'] = setCssToHead([".motto {\n  margin-top: 200px;\n}\n\n.a {\n  height: ",400,";\n  background: #3F536E;\n}\n\n.b {\n  height: 400px;\n}\n\n.c {\n  height: ",600,";\n  background: red;\n}"],'pages/index/index');
__AppCssCode__['pages/logs/logs'] = setCssToHead([".test {\r\n  line-height: ",400,";\r\n  font-size: 30px;\r\n}\r\n\r\n.img {\r\n  width: 100%;\r\n  height: 200px;\r\n}"],'pages/logs/logs');
__AppCssCode__['app'] = setCssToHead(["/**app.wxss**/\n.container {\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-between;\n  padding: ",200," 0;\n  box-sizing: border-box;\n} \n"],'app');
