import kiple from 'kiple-platform/service/api/index';
import { define, require } from '@/core/service/helpers/require';
import { Page, getCurrentPages } from '@/core/service/page';
import { App, getApp, initApp } from '@/core/service/page/app';
import { Component } from '@/core/service/page/component';

const pageFunction = { App, Page, Component, getApp, getCurrentPages };

class KipleApp {
  constructor() {
    this._init();
  }

  _init() {
    Object.assign(window, pageFunction, { kiple }, { define, require, initApp });

    window.serviceJSBridge = {
      subscribe: KipleServiceJSBridge.subscribe,
      publishHandler: KipleServiceJSBridge.publishHandler,
      subscribeHandler: KipleServiceJSBridge.subscribeHandler,
    };
  }
}
new KipleApp();
