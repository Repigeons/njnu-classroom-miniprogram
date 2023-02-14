// app.ts
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
    const storageKeys = [
      "latestOverview",
      "notice",
      "getCoreQueryClassroomsJson",
      "getCoreQueryBuildingsJson",
      "getCoreQueryZylxdmJson",
      "getExploreGridsJson",
      "getExploreShuttleStationsJson",
    ]
    wx.getStorageInfo({
      success(res) {
        res.keys.forEach(key => {
          const del = !storageKeys.includes(key)
          console.info("delete storage", key, del)
          if (del) wx.removeStorage({ key })
        })
      }
    })
    cachedCoreQueryClassroomsJson(true)
    cachedCoreQueryBuildingsJson(true)
    cachedCoreQueryZylxdmJson(true)
    cachedExploreGridsJson(true)
    cachedExploreShuttleStationsJson(true)
    cachedCoreQueryZylxdmJson(true)

    // ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", ""].forEach(day => getShuttle(day, true))
  }
})