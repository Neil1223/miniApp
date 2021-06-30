import * as fs from 'fs-extra';

// const files = ['.png', '.jpg', '.svg', '.mp4', '.mov', '.m4v', '.3gp', '.avi', '.m3u8', '.webm'];

import { getRelativePath, getResolvePath, resolveApp } from '../utils';

const transformStaticFile = (files: string[], curPath: string, inputFile: string) => {
  console.log(files, curPath, inputFile);
  files.forEach((item) => {
    const path = JSON.parse(item);
    let filePath = '';
    if (/^(\.\/)|(\.\.\/)/.test(path)) {
      // 处理相对路径
      filePath = getResolvePath(curPath, '../', path);
    } else if (/\//.test(path)) {
      // 处理绝对路径
      filePath = getResolvePath(inputFile, '../', `.${path}`);
    }
    console.log('目标文件:', filePath);
    const resolvePath = getRelativePath(inputFile, filePath);
    const resultPath = getResolvePath(resolveApp('./dist'), resolvePath);
    console.log('编译后的文件:', resultPath);
    fs.copySync(filePath, resultPath);
  });
};

export default transformStaticFile;
