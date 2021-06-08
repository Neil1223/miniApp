import * as fs from 'fs-extra';
import { IConfig } from '.';
import { getFileContent, getResolvePath, resolveApp } from '../utils';

/**
 * 处理小程序中的所有页面的 .json 文件
 */
const parserJson = () => {
  return {
    name: 'transform-json',
    transform(source: any, fileName: string) {
      if (/app\.json$/.test(fileName)) {
        const config: IConfig = JSON.parse(source);
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

        // 拷贝 index.html 到 dist 目录
        fs.copyFileSync(resolveApp('compiler/v0.2/injects/index.html'), resolveApp('dist/index.html'));

        return `window.__wxConfig = ${JSON.stringify(config)}`;
      }
      return null;
    },
  };
};

export default parserJson;
