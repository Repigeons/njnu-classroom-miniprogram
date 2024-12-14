// app.ts
import { portalApi } from './apis'
import {
  cachedCoreQueryClassroomsJson,
  cachedCoreQueryBuildingsJson,
  cachedCoreQueryZylxdmJson,
  cachedExploreGridsJson,
  cachedExploreShuttleStationsJson,
} from './utils/cacheable'

App<IAppOption>({
  globalData: {
  },

  onLaunch() {
    this.login()
    this.clearStorage()
    cachedCoreQueryClassroomsJson(true)
    cachedCoreQueryBuildingsJson(true)
    cachedCoreQueryZylxdmJson(true)
    cachedExploreGridsJson(true)
    cachedExploreShuttleStationsJson(true)
    cachedCoreQueryZylxdmJson(true)
  },

  async login() {
    const res = await wx.login()
    const resp = await portalApi.login(res.code)
    await wx.setStorage({
      key: 'token',
      data: resp.token,
    })
  },

  async clearStorage() {
    const storageKeys = [
      "token",
      "notice",
      "latestOverview",
      "getCoreQueryClassroomsJson",
      "getCoreQueryBuildingsJson",
      "getCoreQueryZylxdmJson",
      "getExploreGridsJson",
      "getExploreShuttleStationsJson",
    ]
    const res = await wx.getStorageInfo()
    res.keys.forEach(key => {
      const del = !storageKeys.includes(key)
      console.info("delete storage", key, del)
      if (del) wx.removeStorage({ key })
    })
  }
})
