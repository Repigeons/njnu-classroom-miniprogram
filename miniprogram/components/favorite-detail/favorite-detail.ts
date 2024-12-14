// components/class-detail/class-detail.ts

import { exploreApi } from "../../apis/api"

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    detail: Array,
    itemId: Number,
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
          text: '删除',
          tap: async () => {
            const { title, detail, itemId } = this.data
            this.setData({ title: '' })
            const res = await wx.showModal({
              title: '确认删除？',
              content: `是否确认删除 "${title}"`
            })
            if (res.confirm) {
              await exploreApi.deleteFavorites(itemId.toString())
              this.triggerEvent("refresh")
            } else {
              this.setData({ title, detail })
            }
          }
        }, {
          text: '关闭',
          tap: () => this.setData({ title: '' })
        }]
      })
    }
  }
})
