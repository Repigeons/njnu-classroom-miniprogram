import { CoreApi, ExploreApi, PortalApi } from './apis/index'

const BASE_URL = 'https://njnu-classroom.repigeons.cn'
export const coreApi = new CoreApi(`${BASE_URL}/core`)
export const exploreApi = new ExploreApi(`${BASE_URL}/explore`)
export const portalApi = new PortalApi(`${BASE_URL}/portal`)

export const sendRequest = async <T>(promise: Promise<T>) => {
  try {
    return await promise
  } catch (e) {
    const resp = await e.json()
    wx.showToast({
      title: resp.message,
    })
    throw e
  }
}
