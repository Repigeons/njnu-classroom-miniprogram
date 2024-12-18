// components/class-detail/class-detail.ts

import { exploreApi, UserFavoritesDto } from "../../apis/api"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    detail: Array,
    dto: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    dialog_buttons: Array<IButton>()
  },

  /**
   * 组件的方法列表
   */
  methods: {

  },

  lifetimes: {
    attached() {
      this.setData({
        dialog_buttons: [{
          text: '关闭',
          tap: () => this.setData({ title: '' })
        }, {
          text: '添加到收藏',
          tap: async () => {
            const dto = this.data.dto as UserFavoritesDto
            await exploreApi.saveFavorites(dto)
            wx.showToast({ title: '添加收藏成功' })
            this.setData({ title: '' })
          }
        }]
      })
    }
  }
})
