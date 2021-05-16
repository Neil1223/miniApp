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

const route = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab', 'navigateBack'];

const apis = [...storage, ...device, ...route];

export default apis;
