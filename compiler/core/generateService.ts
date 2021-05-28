import * as fs from 'fs-extra';
import { resolveApp } from '../utils';

const resultFile = resolveApp('dist/service-test.js');

const generateServiceFile = (data: Object) => {
  let fileStr = '';
  for (const key in data) {
    if (data[key]) {
      fileStr += data[key];
    }
  }
  fileStr += `\nrequire('app.js');\n initApp();`;
  fs.outputFileSync(resultFile, fileStr);
};

export default generateServiceFile;
