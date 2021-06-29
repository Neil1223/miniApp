const getRealRoute = (e: string, t: string): string => {
  if (t.indexOf('./') === 0) return getRealRoute(e, t.substr(2));
  let n;
  let i;
  const o = t.split('/');
  for (n = 0, i = o.length; n < i && o[n] === '..'; n++);
  o.splice(0, n);
  t = o.join('/');
  const r = e.length > 0 ? e.split('/') : [];
  r.splice(r.length - n - 1, n + 1);
  return r.concat(o).join('/');
};

export const getRealPath = (filePath: string) => {
  const SCHEME_RE = /^([a-z-]+:)?\/\//i;
  const DATA_RE = /^data:.*,.*/;

  // 无协议的情况补全 https
  if (filePath.indexOf('//') === 0) {
    filePath = 'https:' + filePath;
  }

  // 网络资源或base64
  if (SCHEME_RE.test(filePath) || DATA_RE.test(filePath)) {
    return filePath;
  }

  // TODO 处理相对路径和绝对路径

  return filePath;
};
