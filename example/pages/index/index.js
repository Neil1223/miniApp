const data = require('./data');
var app = getApp();

const sum = (a, b) => a + b;

console.log(sum(1, 2));

Page({
  data: {
    motto: 'Hello World',
  },
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs',
    });
  },
  onLoad() {
    console.log('===============', app, data);
  },
});
