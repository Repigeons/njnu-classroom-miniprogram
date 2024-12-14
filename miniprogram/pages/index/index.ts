import { portalApi } from "../../apis/api"

// pages/index/index.ts
Page({
  data: {
    text: ''
  },

  async onLoad() {
    try {
      const service = await portalApi.getServiceSwitch()
      if (service.data) {
        wx.reLaunch({ url: '/pages/empty/empty' })
      } else {
        this.setData({ text: '本学期已经结束，南师教室也放假啦~~~' })
      }
    } catch {
      this.setData({ text: '系统异常！反馈QQ群：1150057272' })
    }
  }
})
