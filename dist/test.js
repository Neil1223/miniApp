function Geeks() {
  var tt = document.createElement('wx-button');
  tt.setAttribute('type', 'warn');
  tt.innerText = 'test button';
  document.body.appendChild(tt);
  setTimeout(() => {
    tt.setAttribute('type', 'primary');
    setTimeout(() => {
      tt.remove();
    }, 1000);
  }, 1000);
}

const loadPage = () => {
  loadSprint('pages/API/Test');
  Page({
    data: {
      timer: '回调函数执行0次',
      id: 0,
      count: 20,
    },
    onLoad: function onLoad(options) {
      console.log('load');
    },
    addFunc() {
      // this.setData({ count: ++this.data.count });
      console.log('Page里面的函数');
    },
    subFunc() {
      // this.setData({ count: --this.data.count });
    },
  });
};

const TestCom = (pageData) => {
  const count = pageData['count'];
  return core.createElement(
    'div',
    {
      class: 'asd',
      // onClick: aa,
    },
    core.createElement(
      'span',
      {
        loading: 'false',
      },
      '12asd'
    ),
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
  'pages/API/Test': { render: TestCom },
};

// 下面的这两步，都应该是在内部实现的，这里只需要调用 init(path)，就可以了
loadPage();
registerPage('pages/API/Test');
