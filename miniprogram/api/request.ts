import { RequestFunctionParams } from 'yapi-to-typescript'
export { FileData } from 'yapi-to-typescript'

const { envVersion } = wx.getAccountInfoSync().miniProgram
console.info('envVersion:', envVersion)

export default function request<TResponseData>(
  payload: RequestFunctionParams,
): Promise<TResponseData> {
  return new Promise<TResponseData>((resolve, reject) => {
    // 基本地址
    const baseUrl = envVersion === 'release'
      ? payload.prodUrl
      : payload.devUrl
      // : 'http://njnu-classroom.io'

    // 请求地址
    const url = `${baseUrl}${payload.path}`
    const token = wx.getStorageSync('token')
    const authorization = token ? `Bearer ${token}` : 'undefined'

    // 具体请求逻辑
    if (payload.hasFileData) {
      let name = Object.keys(payload.fileData)[0]
      let filePath = payload.fileData[name]
      wx.uploadFile({
        url, name, filePath,
        formData: payload.data,
        header: { authorization },
        success(res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const resp = JSON.parse(res.data) as IJsonResponse
            if (resp.status >= 200 && resp.status < 300) {
              resolve(resp.data as TResponseData)
            }
            else {
              wx.showToast({
                title: resp.message ? resp.message : '服务器异常',
                icon: 'error'
              })
            }
          } else {
            wx.showToast({
              title: '服务器异常',
              icon: 'error'
            })
            reject(res)
          }
        },
        fail(err) {
          wx.showToast({
            title: '请求失败',
            icon: 'error'
          })
          reject(err)
        }
      })
    } else {
      wx.request({
        url,
        method: `${payload.method}` as unknown as undefined,
        data: payload.data,
        header: { authorization },
        success(res) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const resp = res.data as IJsonResponse
            if (resp.status >= 200 && resp.status < 300) {
              resolve(resp.data as TResponseData)
            }
            else {
              wx.showToast({
                title: resp.message ? resp.message : '服务器异常',
                icon: 'error'
              })
            }
          } else {
            wx.showToast({
              title: '服务器异常',
              icon: 'error'
            })
            reject(res)
          }
        },
        fail(err) {
          wx.showToast({
            title: '请求失败',
            icon: 'error'
          })
          reject(err)
        }
      })
    }
  })
}
