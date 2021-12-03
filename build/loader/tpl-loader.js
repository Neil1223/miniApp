const path = require('path');

module.exports = function (source) {
  return `export default \`${source}\``;
};
