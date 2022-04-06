import * as fs from 'fs-extra';
import { IConfig, IPageModule } from '.';
import { fileIsExist, getFileContent, getHashCode, getResolvePath, getUpperCasePath, resolveApp } from '../utils';

/**
 * 生成 app-config.js
 */
const generateConfig = (config: IConfig, fileName: string, _this: any) => {
  config.page = {};
  for (let index = 0; index < config.pages.length; index++) {
    const page = config.pages[index];
    const targetPath = getResolvePath(fileName, '../', page);

    if (fileIsExist(targetPath + '.json')) {
      const pageJson = getFileContent(targetPath + '.json');
      config.page[page] = pageJson ? JSON.parse(pageJson) : {};
    }

    // 监听页面 json 配置的变化
    _this.addWatchFile(getResolvePath(fileName, '../', page + '.json'));
  }

  config.entryPagePath = config.entryPagePath ? config.entryPagePath : config.pages[0];
  config.global = { window: config.window };
  delete config.window;

  const source = `window.__wxConfig = ${JSON.stringify(config)}`;
  _this.emitFile({ type: 'asset', fileName: 'app-config.js', source });
};

/**
 * 处理 app.json，批量导入 page js 文件,生成 app-service.js, 同时生成 app-config.js
 */
export const serviceRoot = () => ({
  name: 'transform-config',
  transform(source: string, fileName: string) {
    if (/app\.json$/.test(fileName)) {
      const config: IConfig = JSON.parse(source);

      // 处理 page js 文件
      var code = `import './app.js';`;
      config.pages.forEach((item) => {
        const targetPath = getResolvePath(fileName, '../', item);
        (this as any).addWatchFile(targetPath + '.kml');

        if (!fileIsExist(targetPath + '.js')) {
          (this as any).addWatchFile(targetPath + '.js');
          (this as any).error(`未找到 app.json 中的定义的 pages "${item}" 对应的 .js 文件`);
        }
        code += `import './${item}';`;
      });

      // 初始化程序
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
 * 处理 app.json，批量导入 page kml/css 文件
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
        let cssModuleName = moduleName + 'Style';
        const targetPath = getResolvePath(fileName, '../', item);

        (this as any).addWatchFile(targetPath + '.js');

        // 只有当page必要的文件都存在时，才进行导入 .kml
        if (!fileIsExist(targetPath + '.kml')) {
          (this as any).addWatchFile(targetPath + '.kml');
          (this as any).error(`未找到 app.json 中的定义的 pages "${item}" 对应的 .kml 文件`);
        }

        code += `import ${moduleName} from './${item}.kml';`;

        // 判断 .css 文件是否存在，存在的话才进行导入，不存在的话加如监听
        if (fileIsExist(targetPath + '.css')) {
          code += `import ${cssModuleName} from './${item}.css';`;
        } else {
          (this as any).addWatchFile(targetPath + '.css');
          cssModuleName = '';
        }

        result.push({ path: item, resolvePath: targetPath, moduleName, cssModuleName });
      });

      const pages: string[] = [];
      result.forEach((item) => {
        // const hash = getHashCode(item.resolvePath, curTime);
        const hash = getHashCode(getResolvePath(fileName, '../', item.path), curTime);
        pages.push(`${JSON.stringify(item.path)}:{render: ${item.moduleName}, hash: "${hash}"} `);
      });

      code += `\nwindow.app = {${pages.join(',')}};\n__AppCssCode__['app'] = setCssToHead(AppStyle,'app');`;

      // 转换 css
      result.forEach((item) => {
        if (item.cssModuleName) {
          code += `\n__AppCssCode__['${item.path}'] = setCssToHead(${item.cssModuleName},'${item.path}');`;
        }
      });

      return { code, map: null, meta: { time: curTime } };
    }
    return null;
  },
});
