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
        rule.selector = splits.map((item) => item.replace(/\s$/, '') + `[${scope}]`).join(',');
      });
    },
  };
};
postcssScope.postcss = true;

export default postcssScope;
