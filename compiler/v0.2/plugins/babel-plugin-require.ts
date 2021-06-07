/**
 *babel 插件，获取语句中的全局变量
 */
const getIdentifier = (identifiers: string[]) => () => {
  return {
    visitor: {
      Identifier(path: any) {
        const name = path.node.name;
        if (path.key !== 'property') {
          identifiers.push(name);
        }
      },
    },
  };
};

export default getIdentifier;
