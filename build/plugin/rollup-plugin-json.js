/**
 * 处理 app.json，批量导入page文件，生成 app-config.json
 */
const transformConfig = () => ({
  name: 'transform-config',
  transform(source, fileName) {
    if (/app\.json$/.test(fileName)) {
      const config = JSON.parse(source);

      var code = `import './app.js';`;
      config.pages.forEach((item) => {
        code += `import './${item}';`;
      });
      code += `\nrequire('app.js');\ninitApp();`;

      return { code, map: null };
    }
    return null;
  },
});

export default transformConfig;
