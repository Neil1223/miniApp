const data = require('./data');
var app = getApp();

const sum = (a, b) => a + b;

console.log(sum(1, 2));

Page({
  data: {
    motto: 'Hello World',
    user: { name: 'Neil' },
    count: 10,
    length: 3,
    name: 'Neil',
  },
  bindViewTap() {
    kiple.navigateTo({
      url: 'pages/logs/logs',
    });
  },
  onLoad() {
    console.log('===============', app, data);
  },
});
