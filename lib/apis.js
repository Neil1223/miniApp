const storage = [
  'setStorage',
  'setStorageSync',
  'getStorage',
  'getStorageSync',
  'getStorageInfo',
  'getStorageInfoSync',
  'removeStorage',
  'removeStorageSync',
  'clearStorage',
  'clearStorageSync',
];

const device = ['getSystemInfo', 'getSystemInfoSync', 'canIUse'];

const apis = [...storage, ...device];

export default apis;
