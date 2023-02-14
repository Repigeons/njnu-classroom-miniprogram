import { getCoreQueryClassroomsJson, getCoreQueryBuildingsJson, getCoreQueryZylxdmJson, getExploreGridsJson, getExploreShuttleStationsJson } from "../api/index"

/**
 * 数据缓存
 * @param func: 缓存结果的函数
 * @param request: 是否需要立即调用函数获取结果
 */
async function cacheable<TResponseData>(args: { cacheName?: string, func: () => Promise<TResponseData>, request: boolean }): Promise<TResponseData | undefined> {
  const { func, request } = args
  const cacheName = args.cacheName ? args.cacheName : func.name
  if (request) {
    const res = await func()
    if (res)
      wx.setStorage({
        key: cacheName,
        data: res
      })
  }
  const storage = wx.getStorageSync(cacheName)
  if (storage) return storage
  const res = await func()
  if (res)
    wx.setStorage({
      key: cacheName,
      data: res
    })
  return res
}
/**
 * 教室列表
 */
export const cachedCoreQueryClassroomsJson = (request: boolean = false) => cacheable({
  func: getCoreQueryClassroomsJson,
  request
})
/**
 * 教学楼位置
 */
export const cachedCoreQueryBuildingsJson = (request: boolean = false) => cacheable({
  func: getCoreQueryBuildingsJson,
  request
})
/**
 * 资源类型代码
 */
export const cachedCoreQueryZylxdmJson = (request: boolean = false) => cacheable({
  func: getCoreQueryZylxdmJson,
  request
})
/**
 * 发现栏列表
 */
export const cachedExploreGridsJson = (request: boolean = false) => cacheable({
  func: getExploreGridsJson,
  request
})
/**
 * 校车时刻表
 */
export const cachedExploreShuttleStationsJson = (request: boolean = false) => cacheable({
  func: getExploreShuttleStationsJson,
  request
})
