const path = require('path');

module.exports = function (content, map) {
  const resourcePath = this.resourcePath;
  console.log('进入这里222面');
  const ss = `define("${resourcePath}", function(require, module, exports, window,document,frames,self,location,navigator,localStorage,history,Caches,screen,alert,confirm,prompt,fetch,XMLHttpRequest,WebSocket,webkit,ttJSCore,Reporter,print){${content}});\n`;
  return this.callback(null, ss, map);
};
