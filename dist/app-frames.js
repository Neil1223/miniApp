var PagesIndexIndex = createCommonjsModule(function (module, exports) {
  function __getAllTemplate__() {
    var tt__Template = {};
    return {
      tt__Template: tt__Template,
    };
  }

  exports.render = function (ttData, __scope__) {
    var __loopKey__ = '';
    var __templateCount__ = '';
    __scope__ = __scope__ || {};

    var _getAllTemplate__ = __getAllTemplate__(),
      tt__Template = _getAllTemplate__.tt__Template;

    var swiperList = __findData('swiperList', ttData, __scope__);

    var screen = __findData('screen', ttData, __scope__);

    var switchBig = __findData('switchBig', ttData, __scope__);

    var current = __findData('current', ttData, __scope__);

    var prevCurrent = __findData('prevCurrent', ttData, __scope__);

    var data = __findData('data', ttData, __scope__);

    var imageUrl = __findData('imageUrl', ttData, __scope__);

    var scrollTop = __findData('scrollTop', ttData, __scope__);

    var view = __findData('view', ttData, __scope__);

    var isIos = __findData('isIos', ttData, __scope__);

    var tabs = __findData('tabs', ttData, __scope__);

    var tem = __findData('tem', ttData, __scope__);

    var ttResult = [];
    var ttArray = __show_expr(swiperList) || [];
    var ttElem4 = null;
    var ttResult3 = [];
    var ttArray3 = __show_expr(tabs) || [];
    {
      var _transformRepeatObje = __transformRepeatObjectToArray(ttArray),
        __is_object = _transformRepeatObje.__is_object,
        __object_data = _transformRepeatObje.__object_data;

      for (var __index = 0; __index < (__is_object ? __object_data.length : ttArray.length); __index++) {
        var item = __is_object ? __object_data[__index].item : ttArray[__index];
        var index = __is_object ? __object_data[__index].index : __index;
        Object.assign(__scope__, {
          item: item,
          index: index,
        });
        var __temp_loop_key__ = __loopKey__;
        __loopKey__ = __temp_loop_key__ + '(' + ('Array-0-' + index) + ')';
        var index81044 = index;
        var ttElem0 = null;

        try {
          if (index === 0) {
            try {
              ttElem0 = __h(
                'tt-view',
                {
                  __scope_id__: 'bd6157c47a',
                  className: __show_expr('head-box '),
                  key: __loopKey__ ? __loopKey__ + 'ttElem0_if_1' : 'ttElem0_if_1_count_' + __templateCount__,
                },
                __h('tt-frame-animation', {
                  __scope_id__: 'bd6157c47a',
                  className: __show_expr('head-animation'),
                  url: __show_expr('https://sf3-ttcdn-tos.pstatp.com/obj/developer/ide/demo/instant-page/image/category/1.png'),
                  width: __show_expr('600'),
                  height: __show_expr('600'),
                  count: __show_expr('12'),
                  duration: __show_expr('0.5'),
                  playNumber: __show_expr('1'),
                  bindend: __show_expr('end'),
                  direction: __exprWrapper__(__show_expr(current > prevCurrent ? 'right' : current < prevCurrent && current < 1 ? 'left' : ''), [
                    'current',
                    'prevCurrent',
                  ]),
                })
              );
            } catch (error) {
              logger.warn(error);
            }
          } else {
            ttElem0 = __emptyNode();
          }
        } catch (error) {
          logger.warn(error);
        }

        var ttElem1 = null;

        try {
          if (index === 1) {
            try {
              ttElem1 = __h(
                'tt-view',
                {
                  __scope_id__: 'bd6157c47a',
                  className: __show_expr('head-box '),
                  key: __loopKey__ ? __loopKey__ + 'ttElem1_if_2' : 'ttElem1_if_2_count_' + __templateCount__,
                },
                __h('tt-frame-animation', {
                  __scope_id__: 'bd6157c47a',
                  className: __show_expr('head-animation'),
                  url: __show_expr('https://sf3-ttcdn-tos.pstatp.com/obj/developer/ide/demo/instant-page/image/category/2.png'),
                  width: __show_expr('480'),
                  height: __show_expr('480'),
                  count: __show_expr('13'),
                  duration: __show_expr('0.5'),
                  playNumber: __show_expr('1'),
                  bindend: __show_expr('end'),
                  direction: __exprWrapper__(__show_expr(current > prevCurrent ? 'right' : current < prevCurrent ? 'left' : ''), [
                    'current',
                    'prevCurrent',
                  ]),
                })
              );
            } catch (error) {
              logger.warn(error);
            }
          } else {
            ttElem1 = __emptyNode();
          }
        } catch (error) {
          logger.warn(error);
        }

        var ttElem2 = null;

        try {
          if (index === 2) {
            try {
              ttElem2 = __h(
                'tt-view',
                {
                  __scope_id__: 'bd6157c47a',
                  className: __show_expr('head-box '),
                  key: __loopKey__ ? __loopKey__ + 'ttElem2_if_3' : 'ttElem2_if_3_count_' + __templateCount__,
                },
                __h('tt-frame-animation', {
                  __scope_id__: 'bd6157c47a',
                  className: __show_expr('head-animation'),
                  url: __show_expr('https://sf3-ttcdn-tos.pstatp.com/obj/developer/ide/demo/instant-page/image/category/3.png'),
                  width: __show_expr('500'),
                  height: __show_expr('500'),
                  count: __show_expr('13'),
                  duration: __show_expr('0.5'),
                  playNumber: __show_expr('1'),
                  bindend: __show_expr('end'),
                  direction: __exprWrapper__(__show_expr(current > prevCurrent && current > 1 ? 'right' : current < prevCurrent ? 'left' : ''), [
                    'current',
                    'prevCurrent',
                  ]),
                })
              );
            } catch (error) {
              logger.warn(error);
            }
          } else {
            ttElem2 = __emptyNode();
          }
        } catch (error) {
          logger.warn(error);
        }

        var ttResult1 = [];
        var ttArray1 = __show_expr(__valid(__valid(data) ? data[index] : undefined) ? data[index].list : undefined) || [];
        {
          var _transformRepeatObje2 = __transformRepeatObjectToArray(ttArray1),
            _is_object = _transformRepeatObje2.__is_object,
            _object_data = _transformRepeatObje2.__object_data;

          for (var _index = 0; _index < (_is_object ? _object_data.length : ttArray1.length); _index++) {
            var iv = _is_object ? _object_data[_index].item : ttArray1[_index];
            var num = _is_object ? _object_data[_index].index : _index;
            Object.assign(__scope__, {
              iv: iv,
              num: num,
            });
            var _temp_loop_key__ = __loopKey__;
            __loopKey__ = _temp_loop_key__ + '(' + ('Array-1-' + num) + ')';
            var num75089 = num;
            var ttElem3 = null;

            try {
              if (__valid(iv) ? iv.open : undefined) {
                try {
                  var ttResult2 = [];
                  var ttArray2 = __show_expr(__valid(iv) ? iv.pages : undefined) || [];
                  {
                    var _transformRepeatObje3 = __transformRepeatObjectToArray(ttArray2),
                      _is_object2 = _transformRepeatObje3.__is_object,
                      _object_data2 = _transformRepeatObje3.__object_data;

                    for (var _index2 = 0; _index2 < (_is_object2 ? _object_data2.length : ttArray2.length); _index2++) {
                      var i = _is_object2 ? _object_data2[_index2].item : ttArray2[_index2];
                      var n = _is_object2 ? _object_data2[_index2].index : _index2;
                      Object.assign(__scope__, {
                        i: i,
                        n: n,
                      });
                      var _temp_loop_key__2 = __loopKey__;
                      __loopKey__ = _temp_loop_key__2 + '(' + ('Array-2-' + n) + ')';
                      var n21059 = n;
                      ttResult2.push(
                        __h(
                          'tt-view',
                          {
                            __scope_id__: 'bd6157c47a',
                            className: __show_expr('children-body '),
                            'data-path': __show_expr(__valid(i) ? i.path : undefined),
                            bindtap: __show_expr('toRouter'),
                            'data-view': __show_expr(__valid(i) ? i.navigateCustom : undefined),
                            id: __exprWrapper__(
                              __show_expr((__valid(i) ? i.navigateCustom : undefined) ? (__valid(i) ? i.navigateCustom : undefined) : 'x' + num + n),
                              [
                                'data[index].list',
                                'data[index].list.' + num75089,
                                'data[index].list.' + num75089 + '.pages',
                                'data[index].list.' + num75089 + '.pages.' + n21059,
                                'data[index].list.' + num75089 + '.pages.' + n21059 + '.navigateCustom',
                              ]
                            ),
                            key: __loopKey__,
                          },
                          __h(
                            'tt-view',
                            {
                              __scope_id__: 'bd6157c47a',
                              className: __show_expr('children-icon min-icon'),
                            },
                            __h('tt-text', {
                              __scope_id__: 'bd6157c47a',
                            })
                          ),
                          __h(
                            'tt-view',
                            {
                              __scope_id__: 'bd6157c47a',
                              className: __show_expr('children-name min-name'),
                            },
                            __show_expr(__valid(i) ? i.name : undefined)
                          ),
                          __h('tt-image', {
                            __scope_id__: 'bd6157c47a',
                            src: __exprWrapper__(__show_expr(__show_expr(imageUrl) + __show_expr('setting_arrow.png')), ['imageUrl']),
                            className: __show_expr('children-arrow'),
                          })
                        )
                      );
                      __loopKey__ = _temp_loop_key__2;
                    }
                  }
                  ttElem3 = __h(
                    'tt-view',
                    {
                      __scope_id__: 'bd6157c47a',
                      className: __exprWrapper__(
                        __show_expr((__valid(__valid(iv) ? iv.pages : undefined) ? iv.pages.length : undefined) !== 0 && 'top-border list-show'),
                        [
                          'data[index].list',
                          'data[index].list.' + num75089,
                          'data[index].list.' + num75089 + '.pages',
                          'data[index].list.' + num75089 + '.pages.length',
                        ]
                      ),
                      key: __loopKey__ ? __loopKey__ + 'ttElem3_if_4' : 'ttElem3_if_4_count_' + __templateCount__,
                    },
                    ttResult2
                  );
                } catch (error) {
                  logger.warn(error);
                }
              } else {
                ttElem3 = __emptyNode();
              }
            } catch (error) {
              logger.warn(error);
            }

            ttResult1.push(
              __h(
                'tt-view',
                {
                  __scope_id__: 'bd6157c47a',
                  key: __loopKey__,
                },
                __h(
                  'tt-view',
                  {
                    __scope_id__: 'bd6157c47a',
                    className: __show_expr('children-body'),
                    bindtap: __show_expr('showChildren'),
                    'data-index': __show_expr(index),
                    'data-num': __show_expr(num),
                    'data-open': __show_expr(__valid(iv) ? iv.open : undefined),
                  },
                  __h('tt-image', {
                    __scope_id__: 'bd6157c47a',
                    src: __exprWrapper__(__show_expr(__valid(iv) ? iv.icon : undefined), [
                      'data[index].list',
                      'data[index].list.' + num75089,
                      'data[index].list.' + num75089 + '.icon',
                    ]),
                    mode: __show_expr('aspectFit'),
                    className: __show_expr('children-icon'),
                  }),
                  __h(
                    'tt-view',
                    {
                      __scope_id__: 'bd6157c47a',
                      className: __show_expr('children-name'),
                    },
                    __show_expr(__valid(iv) ? iv.name : undefined)
                  ),
                  __h('tt-image', {
                    __scope_id__: 'bd6157c47a',
                    src: __exprWrapper__(__show_expr(__show_expr(imageUrl) + __show_expr('arrow.png')), ['imageUrl']),
                    className: __exprWrapper__(
                      __show_expr(
                        __show_expr(' children-arrow box-arrow ') +
                          __show_expr((__valid(iv) ? iv.open : undefined) ? 'children-arrow-default' : 'children-arrow-active')
                      ),
                      ['data[index].list', 'data[index].list.' + num75089, 'data[index].list.' + num75089 + '.open']
                    ),
                  })
                ),
                ttElem3
              )
            );
            __loopKey__ = _temp_loop_key__;
          }
        }
        ttResult.push(
          __h(
            'tt-view',
            {
              __scope_id__: 'bd6157c47a',
              className: __exprWrapper__(
                __show_expr(
                  __show_expr(
                    (screen === 'small' ? 'swiper-list' : 'swiper-big-list') +
                      ' ' +
                      (screen === 'small'
                        ? __valid(item)
                          ? item.swpClass
                          : undefined
                        : !switchBig
                        ? 'switch-' + (__valid(item) ? item.bigClass : undefined)
                        : __valid(item)
                        ? item.bigClass
                        : undefined) +
                      ' ' +
                      (__valid(item) ? item.screenClass : undefined) +
                      ' '
                  ) + __show_expr(current === 1 && prevCurrent && switchBig && index === 0 ? 'revise-animation' : '')
                ),
                [
                  'screen',
                  'swiperList',
                  'swiperList.' + index81044,
                  'swiperList.' + index81044 + '.swpClass',
                  'switchBig',
                  'swiperList.' + index81044 + '.bigClass',
                  'swiperList.' + index81044 + '.screenClass',
                  'current',
                  'prevCurrent',
                ]
              ),
              bindtap: __show_expr('swpBtn'),
              'data-index': __show_expr(index),
              key: __loopKey__,
            },
            __h(
              'tt-view',
              {
                __scope_id__: 'bd6157c47a',
                className: __exprWrapper__(
                  __show_expr(
                    __show_expr('head ') +
                      __show_expr(
                        (__valid(item) ? item.screenClass : undefined) || screen === 'big'
                          ? index === 0
                            ? 'hidden-extend-head'
                            : index === 1
                            ? 'hidden-component-head'
                            : 'hidden-api-head'
                          : 'show-head'
                      )
                  ),
                  ['swiperList', 'swiperList.' + index81044, 'swiperList.' + index81044 + '.screenClass', 'screen']
                ),
              },
              ttElem0,
              ttElem1,
              ttElem2
            ),
            __h(
              'tt-scroll-view',
              {
                __scope_id__: 'bd6157c47a',
                className: __show_expr('body'),
                'scroll-y': __exprWrapper__(__show_expr(screen != 'small'), ['screen']),
                'scroll-with-animation': true,
                'data-index': __show_expr(index),
                bindscroll: __show_expr('bindscroll'),
                'scroll-top': __exprWrapper__(__show_expr(scrollTop), ['scrollTop']),
                'scroll-into-view': __exprWrapper__(__show_expr(view), ['view']),
              },
              __h(
                'tt-view',
                {
                  __scope_id__: 'bd6157c47a',
                  className: __show_expr('section'),
                },
                __h(
                  'tt-view',
                  {
                    __scope_id__: 'bd6157c47a',
                    className: __show_expr('title'),
                  },
                  __show_expr(__valid(__valid(data) ? data[index] : undefined) ? data[index].title : undefined)
                ),
                ttResult1,
                __h('tt-view', {
                  __scope_id__: 'bd6157c47a',
                  className: __show_expr('bottom-line'),
                })
              )
            )
          )
        );
        __loopKey__ = __temp_loop_key__;
      }
    }

    try {
      if (!isIos) {
        try {
          ttElem4 = __h(
            'tt-view',
            {
              __scope_id__: 'bd6157c47a',
              className: __show_expr('vdom-tab-box'),
              key: __loopKey__ ? __loopKey__ + 'ttElem4_if_5' : 'ttElem4_if_5_count_' + __templateCount__,
            },
            __h('tt-view', {
              __scope_id__: 'bd6157c47a',
              className: __show_expr('vdom-tab'),
            })
          );
        } catch (error) {
          logger.warn(error);
        }
      } else {
        ttElem4 = __emptyNode();
      }
    } catch (error) {
      logger.warn(error);
    }

    {
      var _transformRepeatObje4 = __transformRepeatObjectToArray(ttArray3),
        _is_object3 = _transformRepeatObje4.__is_object,
        _object_data3 = _transformRepeatObje4.__object_data;

      for (var _index3 = 0; _index3 < (_is_object3 ? _object_data3.length : ttArray3.length); _index3++) {
        var _item = _is_object3 ? _object_data3[_index3].item : ttArray3[_index3];

        var _index4 = _is_object3 ? _object_data3[_index3].index : _index3;

        Object.assign(__scope__, {
          _item: _item,
          _index4: _index4,
        });
        var _temp_loop_key__3 = __loopKey__;
        __loopKey__ = _temp_loop_key__3 + '(' + ('Array-3-' + _index4) + ')';
        var index49609 = _index4;
        var ttElem5 = null;

        try {
          if (__valid(_item) ? _item.badge : undefined) {
            try {
              ttElem5 = __h(
                'tt-view',
                {
                  __scope_id__: 'bd6157c47a',
                  className: __show_expr('tab-default tab-badge '),
                  key: __loopKey__ ? __loopKey__ + 'ttElem5_if_6' : 'ttElem5_if_6_count_' + __templateCount__,
                },
                __show_expr(__valid(_item) ? _item.badge : undefined)
              );
            } catch (error) {
              logger.warn(error);
            }
          } else {
            ttElem5 = __emptyNode();
          }
        } catch (error) {
          logger.warn(error);
        }

        var ttElem6 = null;

        try {
          if ((__valid(_item) ? _item.redDot : undefined) && !(__valid(tem) ? tem.badge : undefined)) {
            try {
              ttElem6 = __h('tt-view', {
                __scope_id__: 'bd6157c47a',
                className: __show_expr('tab-default tab-redDot'),
                key: __loopKey__ ? __loopKey__ + 'ttElem6_if_7' : 'ttElem6_if_7_count_' + __templateCount__,
              });
            } catch (error) {
              logger.warn(error);
            }
          } else {
            ttElem6 = __emptyNode();
          }
        } catch (error) {
          logger.warn(error);
        }

        ttResult3.push(
          __h(
            'tt-view',
            {
              __scope_id__: 'bd6157c47a',
              className: __show_expr('tab'),
              bindtap: __show_expr('switchTab'),
              'data-index': __show_expr(_index4),
              key: __loopKey__,
            },
            ttElem5,
            ttElem6,
            __h('tt-image', {
              __scope_id__: 'bd6157c47a',
              className: __show_expr('tab-icon'),
              src: __exprWrapper__(
                __show_expr(current === _index4 ? (__valid(_item) ? _item.select : undefined) : __valid(_item) ? _item.icon : undefined),
                ['current', 'tabs', 'tabs.' + index49609, 'tabs.' + index49609 + '.select', 'tabs.' + index49609 + '.icon']
              ),
            }),
            __h(
              'tt-view',
              {
                __scope_id__: 'bd6157c47a',
                className: __exprWrapper__(
                  __show_expr(__show_expr('tab-text ') + __show_expr(current === _index4 ? 'tab-text-active' : 'tab-text-inactive')),
                  ['current']
                ),
              },
              __show_expr('\r\n      '),
              __show_expr(__valid(_item) ? _item.text : undefined),
              __show_expr('\r\n    ')
            )
          )
        );
        __loopKey__ = _temp_loop_key__3;
      }
    }
    return [
      __h(
        'tt-view',
        {
          __scope_id__: 'bd6157c47a',
          className: __show_expr('content'),
        },
        __h(
          'tt-view',
          {
            __scope_id__: 'bd6157c47a',
            className: __show_expr('swiper'),
            bindtouchstart: __show_expr('touchstart'),
            bindtouchmove: __show_expr('touchmove'),
            bindtouchend: __show_expr('touchend'),
          },
          ttResult,
          ttElem4
        )
      ),
      __h(
        'tt-view',
        {
          __scope_id__: 'bd6157c47a',
          className: __show_expr('tabs'),
        },
        ttResult3
      ),
    ];
  };
});
