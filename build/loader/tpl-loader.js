const path = require('path');

module.exports = function (source) {
  const resourcePath = this.resourcePath;
  const fileExtname = path.extname(resourcePath);

  console.log('=====', resourcePath, fileExtname);

  /* 
    // 生成 ast 语法树
    const ast = parse(template.trim(), options)
    // 标记静态内容（以免diff的时候需要重复比较）
    optimize(ast, options)
    // 生成 render function code
    const code = generate(ast, options)
  */

  return `export default \`${source}\``;
};
