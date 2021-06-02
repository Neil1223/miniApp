
  var PagesIndexIndex = (pageData) => {
    var count = pageData[item];
var op = pageData[item];
var title = pageData[item];
var a = pageData[item];
var b = pageData[item];
var c = pageData[item];
var length = pageData[item];
var name = pageData[item];
var Array = pageData[item];

    return createElement('wx-view',{className:"container"},createElement('wx-h5',{className: count > 10 ? 'yes' : 'no' },"这里是page index页面"),createElement('wx-text',{hidden:true},"\"hello\" '测试{{}}表达式'"),createElement('wx-view',null, count > 10 ? '大于10' : '小于等于10' ),createElement('wx-view',null, [1,2,3,4, op] ),createElement('wx-view',null, title.name || count ),createElement('wx-view',null,a + b," + ",c," + d"),createElement('wx-view',null,length > 5),createElement('wx-view',null,"hello" + name,Array.isArray(name) ? 'hello' : 'test'),createElement('wx-view',null,),createElement('wx-view',null,"下面显示data中的count的值=>"),createElement('wx-view',null, count ,"同步"),createElement('wx-button',{size:"mini",bindtap:"addFunc",bindlongtap:"subFunc"},"渲染button"),createElement('wx-button',{size:"mini",type:"primary",bindtap:"bindViewTap"},"跳转渐变页面"),createElement('wx-button',{size:"mini",type:"primary",bindtap:"open2"},"跳转无title页面"),createElement('wx-view',{className:"a"},),createElement('wx-view',{className:"b"},),createElement('wx-view',{className:"c"},))
  };
  