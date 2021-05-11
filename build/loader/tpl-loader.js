const path = require('path');

module.exports = function (source) {
  const resourcePath = this.resourcePath;
  return `export default \`${source}\``;
};
