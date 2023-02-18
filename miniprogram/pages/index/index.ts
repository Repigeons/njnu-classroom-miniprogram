import { getPortalServiceSwitch } from "../../api/index"

// pages/index/index.ts
Page({
  data: {
    off: false
  },

  async onLoad() {
    const service = await getPortalServiceSwitch()
    if (service) {
      wx.reLaunch({
        url: '/pages/empty/empty'
      })
    } else {
      this.setData({ off: true })
    }
  }
})
