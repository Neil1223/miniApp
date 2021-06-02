import * as fs from 'fs-extra';
import { resolveApp } from '../utils';

const serviceFile = resolveApp('dist/service-test.js');
const frameFile = resolveApp('dist/frames-test.js');

export const generateServiceFile = (data: Object) => {
  let fileStr = '';
  for (const key in data) {
    if (data[key]) {
      fileStr += data[key];
    }
  }
  fileStr += `\nrequire('app.js');\n initApp();`;
  fs.outputFileSync(serviceFile, fileStr);
};

export const generateFrameFile = (data: string) => {
  fs.outputFileSync(frameFile, data);
};
