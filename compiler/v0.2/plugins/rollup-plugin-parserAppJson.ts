import * as fs from 'fs-extra';
import { IConfig, IPageModule } from '.';
import { getFileContent, getHashCode, getResolvePath, getUpperCasePath, resolveApp } from '../utils';

/**
 * 生成 app-config.js
 */
const generateConfig = (config: IConfig, fileName: string, _this: any) => {
  config.page = {};
  for (let index = 0; index < config.pages.length; index++) {
    const page = config.pages[index];
    const pageJson = getFileContent(getResolvePath(fileName, '../', page + '.json'));
    if (pageJson) {
      config.page[page] = JSON.parse(pageJson);
    }
  }

  config.entryPagePath = config.entryPagePath ? config.entryPagePath : config.pages[0];
  config.global = { window: config.window };
  delete config.window;

  const source = `window.__wxConfig = ${JSON.stringify(config)}`;
  _this.emitFile({ type: 'asset', fileName: 'app-config.js', source });
};

/**
 * 处理 app.json，批量导入 page js 文件
 */
export const serviceRoot = () => ({
  name: 'transform-config',
  transform(source: string, fileName: string) {
    if (/app\.json$/.test(fileName)) {
      const config: IConfig = JSON.parse(source);

      // 处理 page js 文件
      var code = `import './app.js';`;
      config.pages.forEach((item) => {
        code += `import './${item}';`;
      });
      code += `\nrequire('app.js');\ninitApp();`;

      // 处理小程序配置文件, 生成 app-config.js
      generateConfig(config, fileName, this);

      // 拷贝 index.html 到 dist 目录
      fs.copyFileSync(resolveApp('compiler/v0.2/injects/index.html'), resolveApp('dist/index.html'));

      return { code, map: null };
    }
    return null;
  },
});

const curTime = new Date().getTime();
/**
 * 处理 app.json，批量导入 page kml/css 文件，生成 app-config.json
 */
export const viewRoot = () => ({
  name: 'transform-config',
  transform(source: string, fileName: string) {
    if (/app\.json$/.test(fileName)) {
      const config: IConfig = JSON.parse(source);

      var code = "import {__AppCssCode__,setCssToHead} from  'inject/view.js';import AppStyle from './app.css';";
      const result: IPageModule[] = [];

      // 获取页面的模板和样式
      config.pages.forEach((item) => {
        const moduleName = getUpperCasePath(item);
        const cssModuleName = moduleName + 'Style';
        code += `import ${moduleName} from './${item}.kml';import ${cssModuleName} from './${item}.css';`;
        result.push({ path: item, moduleName, cssModuleName });
      });

      const pages: string[] = [];
      result.forEach((item) => {
        const hash = getHashCode(getResolvePath(fileName, '../', item.path), curTime);
        pages.push(`${JSON.stringify(item.path)}:{render: ${item.moduleName}, hash: "${hash}"} `);
      });

      code += `\nwindow.app = {${pages.join(',')}};\n__AppCssCode__['app'] = setCssToHead(AppStyle,'app');`;

      // 转换 css
      result.forEach((item) => {
        code += `\n__AppCssCode__['${item.path}'] = setCssToHead(${item.cssModuleName},'${item.path}');`;
      });

      return { code, map: null, meta: { time: curTime } };
    }
    return null;
  },
});
