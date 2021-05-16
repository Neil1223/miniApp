const createElement = window.core.createElement;

const PagesIndex = (pageData) => {
  const count = pageData['count'];
  return createElement(
    'div',
    {
      className: count > 10 ? 'ASD' : 'NEIL',
    },
    createElement('h5', null, '这里是page index页面'),
    createElement('span', null, count > 10 ? '大于10' : '小于等于10'),
    createElement('div', null, 'test-div'),
    createElement('div', null, '下面显示data中的count的值=>'),
    createElement('div', null, count),
    createElement(
      'wx-button',
      { size: 'mini', type: 'op', hoverClass: 'kkk', bindtap: 'addFunc', bindlongtap: 'subFunc', className: 'mini-btn', id: 'test' },
      '渲染button'
    ),
    createElement('wx-button', { size: 'mini', type: 'primary', bindtap: 'open' }, '跳转新页面'),
    createElement('div', null, true)
  );
};

const PagesSecond = (pageData) => {
  return createElement(
    'div',
    null,
    createElement('h5', null, '这里是已经跳转了的页面'),
    createElement('wx-button', { size: 'mini', type: 'primary', bindtap: 'back' }, '返回原来的页面')
  );
};

window.app = {
  'pages/index': { render: PagesIndex }, // 这里的key=app-service里面的的pages/index.js
  'pages/second': { render: PagesSecond },
};
