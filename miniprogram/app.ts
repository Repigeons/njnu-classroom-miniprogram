// app.ts
import { getPortalSsoLogin } from './api/index'
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

    // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", ""].forEach(day => getShuttle(day, true))
  },

  async login() {
    const res = await wx.login()
    const resp = await getPortalSsoLogin({ jsCode: res.code })
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