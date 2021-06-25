import * as fs from 'fs-extra';
import * as path from 'path';
import { createHmac } from 'crypto';

export const appRoot = fs.realpathSync(process.cwd());

export const resolveApp = (relativePath: string) => path.resolve(appRoot, relativePath);

export const getResolvePath = (...pathSegments: string[]) => path.resolve(...pathSegments);

export const getFileContent = (path: string) => {
  try {
    return fs.readFileSync(path).toString();
  } catch (error) {
    console.log('get page config error', error);
  }
  return null;
};

export const getRelativePath = (targetPath: string, curPath: string) => {
  let result = path.relative(targetPath, curPath);
  result = result.replace(/\\/g, '/').replace('../', '');
  return result;
};

export const getUpperCasePath = (path: string) => {
  const paths = path.split('/');
  let result = '';
  paths.forEach((item) => {
    item = item.toLowerCase();
    result += item.slice(0, 1).toUpperCase() + item.slice(1);
  });
  return result.split('.')[0];
};

export const getHashCode = (name: string): string => {
  const date = new Date().getTime();
  const hash = createHmac('sha256', 'test')
    .update(name + date)
    .digest('hex');
  const hashArray = hash.match(/[a-z].{7}/);
  return hashArray ? hashArray[0] : 'k' + hash.substr(0, 7);
};
