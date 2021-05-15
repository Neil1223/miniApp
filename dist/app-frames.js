const PagesIndex = (pageData) => {
  const count = pageData['count'];
  return core.createElement(
    'div',
    {
      className: count > 10 ? 'ASD' : 'NEIL',
    },

    core.createElement('span', null, count > 10 ? '大于10' : '小于等于10'),
    core.createElement('div', null, 'test-div'),
    core.createElement('div', null, '下面显示data中的count的值=>'),
    core.createElement('div', null, count),
    core.createElement(
      'wx-button',
      { size: 'mini', type: 'op', hoverClass: 'kkk', bindtap: 'addFunc', bindlongtap: 'subFunc', className: 'mini-btn', id: 'test' },
      '渲染button'
    ),
    core.createElement('div', null, true)
  );
};

window.app = {
  'pages/index': { render: PagesIndex }, // 这里的key=app-service里面的的pages/index.js
};
