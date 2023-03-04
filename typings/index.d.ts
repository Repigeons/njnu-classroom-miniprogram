/// <reference path="./types/index.d.ts" />

interface IAppOption {
  globalData: {
  },
  login: () => Promise<void>,
  clearStorage: () => Promise<void>,
}
