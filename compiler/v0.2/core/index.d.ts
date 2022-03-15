export interface ASTElement {
  type: 'tag' | 'text' | 'style';
  name: string;
  attribs: { [key: string]: any };
  data: string;
  parent: ASTElement | void;
  prev: ASTElement;
  children: ASTElement[];
  __pageVariable__: string; // 当前 page 的路径驼峰变量
}

export interface IDataString {
  variates: string[];
  values: string[];
}

export interface Conditional {
  variateName: string; // if,elif,else 有相同的 variateName
  if?: ASTElement;
  elif?: ASTElement[];
  else?: ASTElement;
}

interface IGenCode {
  variates: string[];
  code: string | string[];
  arrayElements: { [key: string]: ASTElement };
  conditional: Conditional[]; // 条件语句使用有序的数组进行存档，方便遍历的时候获取
}

interface IForCode {
  variates: string[];
  code: string | string[];
}
