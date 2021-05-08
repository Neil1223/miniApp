import { isFn } from '../../util/util';

const SYNC_API_RE = /Sync$/;

interface IOptions {
  success?: Function;
  fail?: Function;
  complete?: Function;
}

export const isSyncApi = (name: string): boolean => {
  const result = SYNC_API_RE.test(name);
  return result;
};

export function shouldPromise(apiName: string) {
  if (isSyncApi(apiName)) {
    return false;
  }
  return true;
}

const handlePromise = (promise: any) => {
  return promise.then((data: any) => [null, data]).catch((err: any) => [err]);
};

export const promisify = (apiName: string, api: Function) => {
  if (!shouldPromise(apiName)) {
    return api;
  }
  return (options: IOptions = {}, ...params: any) => {
    if (isFn(options.success) || isFn(options.fail) || isFn(options.complete)) {
      return api(options, ...params);
    }

    const promiseApi = new Promise((resolve, reject) => {
      const _options = Object.assign({}, options, { success: resolve, fail: reject });
      api(_options, ...params);
    });
    return handlePromise(promiseApi);
  };
};
