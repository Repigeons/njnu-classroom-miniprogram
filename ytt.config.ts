import { defineConfig } from 'yapi-to-typescript'

export default defineConfig([{
  serverUrl: 'http://yapi.repigeons.cn',
  typesOnly: false,
  target: 'typescript',
  reactHooks: {
    enabled: false,
  },
  devEnvName: 'development',
  prodEnvName: 'production',
  outputFilePath: 'miniprogram/api/index.ts',
  requestFunctionFilePath: 'miniprogram/api/request.ts',
  dataKey: 'data',
  projects: [{
    token: '',
    categories: [{
      id: 0,
      getRequestFunctionName(interfaceInfo, changeCase) {
        return changeCase.camelCase(`${interfaceInfo.method}_${interfaceInfo.path}`)
      }
    }]
  }]
}])