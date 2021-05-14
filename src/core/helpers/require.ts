import { isStr } from '@/util';
import { setGlobPageRegisterPath } from '../page';

const modules = {};
const getPagePath = (name: string) => {
  var path = name.match(/(.*)\/([^/]+)?$/);
  return path && path[1] ? path[1] : './';
};
// 生成模块内部的 require 函数
const getRequire = (moduleName: string) => {
  const path = getPagePath(moduleName);
  return (name: string) => {
    if (!isStr(name)) {
      throw new Error('require args must be a string');
    }
    const modulePath = (path + '/' + name).split('/');
    const dirNames = [];
    for (let index = 0, i = modulePath.length; index < i; index++) {
      var dirName = modulePath[index];
      if (dirName !== '' && dirName !== '.') {
        if (dirName === '..') {
          if (!dirNames.length) {
            throw new Error("Can't find module : " + name);
          }
          dirNames.pop();
        } else {
          dirNames.push(dirName);
        }
      }
    }
    var curPath = dirNames.join('/');
    if (!/\.js$/.test(curPath)) {
      curPath += '.js';
    }
    return require(curPath);
  };
};

/**
 * AMD default. define('name',()=>{})
 */
const define = (name: string, factory: Function) => {
  modules[name] = { status: 1, factory };
};
/**
 * AMD require. require('name')
 */
const require = (name: string) => {
  if (!isStr(name)) {
    throw new Error('require args must be a string');
  }
  const path = !/.js$/.test(name) ? name + '.js' : name;
  const module = modules[path];
  if (!module) {
    throw new Error(`module ${path} is not defined`);
  }
  setGlobPageRegisterPath(name);
  if (module.status === 1) {
    const factory = module.factory;
    const _module = { exports: {} };
    module.exports = _module.exports;
    module.status = 2;
    var result;
    if (factory) {
      // 需要在这里执行factory，同时导出函数里面的模块，如果函数有 return 值，那么 return 值当作 module.exports
      // factory ===》 (require,module,exports,window,document)=>{} 只传入必要的三个值，这样在模块中，window，document等就是无效的
      result = factory(getRequire(path), _module, _module.exports); //
      // example
      // module.exports = xxx
      // exports.hh = hh
      // 最终导出的都是 module.exports
    }
    module.exports = _module.exports !== undefined ? _module.exports : result;
  }
  return module.exports;
};

export { define, require };
