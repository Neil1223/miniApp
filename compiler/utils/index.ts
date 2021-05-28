import * as fs from 'fs-extra';
import * as path from 'path';

export const appRoot = fs.realpathSync(process.cwd());

export const resolveApp = (relativePath: string) => path.resolve(appRoot, relativePath);
