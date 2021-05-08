import * as storages from './storage';
import * as device from './device';

const apis = { ...storages, ...device };

export default apis;

// API 实现的时候，如果是使用同步方法进行，包装的，直接return就可以
// API 实现的时候，如果需要使用异步回调，那么需要传入callbackId，然后调用invokeCallbackHandler
