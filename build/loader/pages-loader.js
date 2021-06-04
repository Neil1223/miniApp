const path = require('path');

module.exports = function (content, map) {
  this.cacheable && this.cacheable();
  const resourcePath = this.resourcePath;
  console.log('进入这里面');
  const config = JSON.parse(content);
  console.log(config);
  var ss = '';
  config.pages.forEach((item) => {
    ss += `require('./${item}');`;
  });
  console.log(ss);
  return this.callback(null, ss, map);
};
