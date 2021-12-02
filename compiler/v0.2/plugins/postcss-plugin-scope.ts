import { Rule } from 'postcss';

/**
 * 给每个选择器加上scope
 */
const postcssScope = (scope: string) => {
  return {
    postcssPlugin: 'postcss-scope',
    Root(root: any) {
      // Transform CSS AST here
      root.walkRules((rule: Rule) => {
        const selector = rule.selector.replace(/(?<=(\s|,|^))[a-z]+/g, (e) => `wx-${e}`);
        const splits = selector.split(',');
        // 在选择器后面加上 scope，如果选择器含有伪类，需要在伪类之前加上scope
        rule.selector = splits
          .map((item) => {
            item = item.replace(/\s$/, '');
            if (~item.includes(':')) {
              return item.replace(':', `[${scope}]:`);
            }
            return `${item}[${scope}]`;
          })
          .join(',');
      });
    },
  };
};
postcssScope.postcss = true;

export default postcssScope;
