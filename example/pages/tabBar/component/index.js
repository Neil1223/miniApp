Page({
  data: {
    count: 2,
    list: [
      {
        id: 'view',
        name: '视图容器',
        open: false,
        pages: ['view', 'scroll-view', 'swiper', 'movable-view', 'cover-view'],
      },
      {
        id: 'content',
        name: '基础内容',
        open: false,
        pages: ['text', 'rich-text', 'progress'],
      },
      {
        id: 'form',
        name: '表单组件',
        open: false,
        pages: ['button', 'checkbox', 'form', 'input', 'label', 'picker', 'picker-view', 'radio', 'slider', 'switch', 'textarea', 'editor'],
      },
      {
        id: 'nav',
        name: '导航',
        open: false,
        pages: ['navigator'],
      },
      {
        id: 'media',
        name: '媒体组件',
        open: false,
        pages: ['image', 'video', 'audio'],
      },
      {
        id: 'map',
        name: '地图',
        open: false,
        pages: ['map'],
      },
      {
        id: 'canvas',
        name: '画布',
        open: false,
        pages: ['canvas'],
      },
      {
        id: 'web-view',
        name: '网页',
        open: false,
        pages: ['web-view'],
      },
    ],
  },
});
