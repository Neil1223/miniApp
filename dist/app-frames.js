const createElement = window.core.createElement;
const __AppCssCode__ = {};

const PagesIndex = (pageData) => {
  const count = pageData['count'];
  return createElement(
    'wx-view',
    {
      className: count > 10 ? 'ASD' : 'NEIL',
    },
    createElement('h5', null, '这里是page index页面'),
    createElement('span', null, count > 10 ? '大于10' : '小于等于10'),
    createElement('wx-view', null, 'test-div'),
    createElement('wx-view', null, '下面显示data中的count的值=>'),
    createElement('wx-view', null, count),
    createElement('wx-button', { size: 'mini', bindtap: 'addFunc', bindlongtap: 'subFunc', className: 'mini-btn', id: 'test' }, '渲染button'),
    createElement('wx-button', { size: 'mini', type: 'primary', bindtap: 'open' }, '跳转新页面'),
    createElement('wx-view', { className: 'a' }),
    createElement('wx-view', { className: 'b' }),
    createElement('wx-view', { className: 'c' })
  );
};

const PagesSecond = (pageData) => {
  return createElement(
    'wx-view',
    { className: 'testClass' },
    createElement('img', { src: 'https://hellouniapp.dcloud.net.cn/static/shuijiao.jpg' }),
    createElement('h5', null, '这里是已经跳转了的页面'),
    createElement('wx-button', { size: 'mini', type: 'primary', bindtap: 'back' }, '返回原来的页面'),
    createElement('wx-view', { className: 'a' })
  );
};

window.app = {
  'pages/index': { render: PagesIndex }, // 这里的key=app-service里面的的pages/index.js
  'pages/second': { render: PagesSecond },
};

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

__AppCssCode__['pages/index'] = setCssToHead(
  ['.a {height: 400px;background: #fff000;}\n.b {height: 400px;background: blue;}\n.c {height: 400px;background: red;} '],
  'pages/index'
);

__AppCssCode__['pages/second'] = setCssToHead(
  [
    '.testClass {\n  margin-top: ',
    0,
    ';\n  height: ',
    300,
    ';\n  background: #fff000;\n}\n.testClass img{width:100%;}\n.a {\n  height: ',
    1800,
    ';\n  background: blue;opacity: 0.3;\n line-height: ',
    80,
    ';\n}\n',
  ],
  'pages/second'
);
