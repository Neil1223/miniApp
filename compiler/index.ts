import * as fs from 'fs-extra';
import { generateServiceFile, generateFrameFile } from './core/generateService';
import { transformJsCode } from './core/transformJsCode';
import { transformTemplate } from './core/transformTemplate';
import { resolveApp } from './utils';

const startTime = new Date().getTime();
const appJsonPath = resolveApp('example/app.json');

const appJson = JSON.parse(fs.readFileSync(appJsonPath).toString());

const pages: string[] = appJson.pages;
const appServiceData = {};
const appViewData = {};

try {
  pages.forEach((item) => {
    Object.assign(appServiceData, transformJsCode(item, resolveApp('example')));
    Object.assign(appViewData, transformTemplate(item, resolveApp('example')));
  });
  generateServiceFile(appServiceData);
  generateFrameFile(appViewData);
} catch (error) {
  console.error('error:', error);
}

const endTime = new Date().getTime();
console.log('==========时间差===================', endTime - startTime);
