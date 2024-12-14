// favorites
import { exploreApi } from '../../../../apis'
import { userFavoritesItem2dialog } from '../../../../utils/parser'
import { getJc } from '../../../../utils/util'

Page({
  data: {
    // 布局
    cell: {
      height: 0,
      width: 0,
      left: 8,
      top: 56,
      ratio: .8,
    },
    idle: true,
    // 周日->0
    today: new Date().getDay(),
    dqjc: 0,
    timeArray: [
      ['08:00', '08:40'], ['08:45', '09:25'], ['09:40', '10:20'], ['10:35', '11:15'], ['11:20', '12:00'],
      ['13:30', '14:10'], ['14:15', '14:55'], ['15:10', '15:50'], ['15:55', '16:35'],
      ['18:30', '19:10'], ['19:20', '20:00'], ['20:10', '20:50'],
    ],
    // 结果集
    result: Array<TimetableBar>(),
    dialog: { title: '', detail: [], itemId: 0 } as TimetableDetailDialog
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    const { windowHeight, windowWidth } = wx.getSystemInfoSync()
    const cellHeight = (windowHeight - (this.data.cell.top + 20 + 2)) / 13
    const cellWidth = (windowWidth - (this.data.cell.left * 2 + 2)) / 8 - 1
    this.setData({
      'cell.height': cellHeight,
      'cell.width': cellWidth,
      dqjc: getJc(new Date()),
    })
  },

  /**
   * 查询用户收藏
   */
  async onShow() {
    const result = await exploreApi.getFavorites()
    console.debug('favorites', result)
    let kcmclimit = 0
    const dayMapper: Record<string, number> = {
      'MON': 0,
      'TUE': 1,
      'WED': 2,
      'THU': 3,
      'FRI': 4,
      'SAT': 5,
      'SUN': 6,
    }
    for (let i = 0; i < result.length; i++) {
      const item = result[i] as TimetableBar
      this.setData({ idle: true })
      if (dayMapper[item.weekday] + 1 === this.data.today) {
        if (item.ksjc <= this.data.dqjc + 1)
          if (item.jsjc >= this.data.dqjc + 1)
            this.setData({ idle: false })
      }
      item.left = dayMapper[item.weekday]
      kcmclimit = (this.data.cell.height * (item.jsjc - item.ksjc + 1)) / (this.data.cell.width * this.data.cell.ratio / 3 * 1.3) * 3
      const title = item.title as string
      item.shortkcmc = title.length > kcmclimit ? title.substring(0, kcmclimit - 3) + '...' : item.title
    }
    this.setData({ result })
  },

  /**
   * 显示详细信息
   */
  showDialog(e: WechatMiniprogram.CustomEvent) {
    const index: number = e.currentTarget.dataset.index
    const item = this.data.result[index]
    this.setData({ dialog: userFavoritesItem2dialog(item) })
  }
})
