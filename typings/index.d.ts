/// <reference path="node_modules/miniprogram-api-typings/index.d.ts" />
/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
  },
  login: () => Promise<void>,
  clearStorage: () => Promise<void>,
}
