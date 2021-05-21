let scrollListener: any = false;

const onShow = () => {
  // 当页面显示的时候，如果已经存在 scroll 事件监听，都需要移除它
  if (scrollListener) {
    document.removeEventListener('scroll', scrollListener);
  }

  // 获取
  const enableTransparentTitleNView = false;
  const enablePageScroll = false;
  const enablePageReachBottom = false;

  // page 是渐变 title,或是监听滑动事件,或监听滑动到底部事件,才进行 scroll 事件的监听
  if (enableTransparentTitleNView || enablePageScroll || enablePageReachBottom) {
    // 初始化 scroll 监听
    // scrollListener = createScrollListener(vm.$page.id, {
    //   enablePageScroll,
    //   enablePageReachBottom,
    //   onReachBottomDistance,
    //   enableTransparentTitleNView,
    // });

    scrollListener = () => {
      console.log('页面滑动');
    };

    requestAnimationFrame(function () {
      document.addEventListener('scroll', scrollListener);
    });
  }
};

export default onShow;
