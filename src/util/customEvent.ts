import EventEmitter from 'eventemitter3';

const customEmitter = new EventEmitter();

export default customEmitter;

export const on = customEmitter.on.bind(customEmitter);
export const off = customEmitter.off.bind(customEmitter);
export const once = customEmitter.once.bind(customEmitter);
export const emit = customEmitter.emit.bind(customEmitter);
