import { ASTElement, IGenCode } from '.';
import { getFileContent, getRelativePath, getResolvePath, getUpperCasePath } from '../utils';
import { getTempGlobalData } from './helper';

// 保存已经存在的template模板路径, key:路径变量(PagesApiImageImage);
interface ITemplateStore {
  [pageVariable: string]: {
    [templatePath: string]: any; // key: 模板的相对路径(./..xxx.kml); value: 模板的 name
    names: string[]; // 保存当前页面的所有name
  };
}
const templates: ITemplateStore = {};

/**
 * 保存引入的 template 模板
 * @param htmlAST {ASTElement} 页面模板的 ast 元素
 * @param pagePath {String} 页面路径
 */
export const saveImportedTemplate = (htmlAST: ASTElement[], inputFile: string, fileName: string) => {
  const pagePath = getRelativePath(inputFile, fileName);
  const pageVariable = getUpperCasePath(pagePath).split('.')[0];

  let pageEl: any = null;
  let importModules = '';
  let useModules = '';
  for (let index = 0; index < htmlAST.length; index++) {
    if (htmlAST[index] && htmlAST[index].type === 'tag' && (htmlAST[index] as any).name === 'import') {
      let src = htmlAST[index].attribs.src as string;
      if (src) {
        if (!~src.indexOf('.kml')) {
          src = src + '.kml';
        }
        if (src[0] === '/') {
          src = getResolvePath(inputFile, '../', '.' + src);
          src = getRelativePath(fileName, src);
        }
        // 处理引用相同的文件
        if (templates[pageVariable] && typeof templates[pageVariable][src] !== 'undefined') {
          continue;
        }

        // 读取src文件，获取template的内容，判断内容是否符合规范：以template包裹，含有name属性
        let templateCont = getFileContent(getResolvePath(fileName, '../', src));
        if (!templateCont) {
          throw new Error('请选择正确的 template 路径!');
        }
        const name = templateCont.trim().match(/(?<=\<template.*name=\"|').*?(?=\"|')/i);
        if (!name) {
          throw new Error('template 模板格式不正确!');
        }
        // 处理相同 name 的 template 引用
        if (templates[pageVariable] && typeof templates[pageVariable].names.includes(name[0])) {
          throw new Error('当前页面已包含name=`' + name[0] + '`的模板引用');
        }

        if (!templates[pageVariable]) {
          templates[pageVariable] = { [src]: name[0], names: [name[0]] };
        } else {
          templates[pageVariable][src] = name[0];
          templates[pageVariable].names.push(name[0]);
        }
        const moduleName = pageVariable + '_' + name[0];
        importModules += `import ${moduleName} from '${src}';`;
        useModules += `__AppTemplateCode__['${moduleName}'] = ${moduleName};`;
      }
    } else if (htmlAST[index] && htmlAST[index].type === 'tag') {
      pageEl = htmlAST[index];
      // 如果节点的第一个标签是 template 同时含有 name 属性，那么将他转化为 view 标签
      if (pageEl.name === 'template' && pageEl.attribs && pageEl.attribs.name) {
        pageEl.name = 'view';
        pageEl.attribs.isTemplate = '';
      }

      break;
    }
  }

  const importTemplate = `
    ${useModules ? "import {__AppTemplateCode__} from 'inject/view.js';" : ''}
    ${importModules}
    ${useModules}
  `;

  return [importTemplate, pageEl as ASTElement];
};

/**
 * 处理 template 标签
 * @param htmlAST {ASTElement} 需要处理的template节点
 */
const transformTemplate = (htmlAST: ASTElement): IGenCode => {
  let result: IGenCode = { variates: [], code: '', arrayElements: {}, conditional: [] };
  const { is, data } = htmlAST.attribs;

  // 判断 is 是否存在
  if (!is) {
    templates[is] = is;
    throw new Error('请选择 template 路径!');
  }

  // 处理 data 数据
  const _data = data ? data.replace('{{', '{').replace('}}', '}') : undefined;
  result.variates = getTempGlobalData('var testVariable = ' + _data);

  result.code = `__renderTemplate('${htmlAST.__pageVariable__}_${is}',${_data})`;
  return result;
};

export default transformTemplate;
