import * as fs from 'fs-extra';
import generateServiceFile from './core/generateService';
import { transformJsCode } from './core/transformJsCode';
import { resolveApp } from './utils';

const startTime = new Date().getTime();
const appJsonPath = resolveApp('example/app.json');

const appJson = JSON.parse(fs.readFileSync(appJsonPath).toString());

const pages: string[] = appJson.pages;
const appServiceData = {};

try {
  pages.forEach((item) => {
    Object.assign(appServiceData, transformJsCode(item, resolveApp('example')));
  });
  generateServiceFile(appServiceData);
} catch (error) {
  console.error('error:', error.message || error);
}

const endTime = new Date().getTime();
console.log('==========时间差===================', endTime - startTime);
