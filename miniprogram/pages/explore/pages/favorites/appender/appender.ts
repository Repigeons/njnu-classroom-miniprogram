import { exploreApi, UserFavoritesDtoWeekdayEnum } from "../../../../../apis"

// pages/explore/pages/favorites/appender/appender.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dayArray: [
      { label: '周一', value: 'MON' },
      { label: '周二', value: 'TUE' },
      { label: '周三', value: 'WED' },
      { label: '周四', value: 'THT' },
      { label: '周五', value: 'FRI' },
      { label: '周六', value: 'SAT' },
      { label: '周日', value: 'SUN' },
    ],
    daySelected: 0,
    jcArray: [
      { label: '第1节' }, { label: '第2节' }, { label: '第3节' }, { label: '第4节' },
      { label: '第5节' }, { label: '第6节' }, { label: '第7节' }, { label: '第8节' },
      { label: '第9节' }, { label: '第10节' }, { label: '第11节' }, { label: '第12节' },
    ],
    ksjc: 0,
    jsjc: 0,
    name: '',
    place: '',
    remark: [{ field: '', value: '' }],
    colorArrar: Array(),
    colorSelected: 0,
  },

  onLoad() {
    const colorArrar = ['#ffffff']
    for (let i = 1; i < 14 * 6; i++) {
      let color = '#'
      for (let j = 0; j < 6; j++) {
        color += Math.floor(Math.random() * 16).toString(16)
      }
      colorArrar.push(color)
    }
    this.setData({ colorArrar })
  },

  bindinput(e: any) {
    const { field, limit } = e.currentTarget.dataset
    const value: string = e.detail.value.substr(0, +limit)
    this.setData({ [field]: value })
  },

  bindRangeChange(e: any) {
    let [daySelected, ksjc, jsjc] = e.detail.value
    if (ksjc > jsjc) {
      const tmp = ksjc
      ksjc = jsjc
      jsjc = tmp
    }
    this.setData({ daySelected, ksjc, jsjc })
  },

  bindAddField() {
    const remark = this.data.remark.concat({ field: '', value: '' })
    this.setData({ remark })
  },

  bindDelField(e: any) {
    const { index } = e.currentTarget.dataset
    const remark = this.data.remark
    remark.splice(+index, 1)
    this.setData({ remark })
  },

  bindSelectColor(e: any) {
    this.setData({
      colorSelected: +e.currentTarget.dataset.index
    })
  },

  async bindSave() {
    const remark: Record<string, any> = {}
    this.data.remark.forEach(it => { if (it.field) remark[it.field] = it.value })
    await exploreApi.saveFavorites({
      title: this.data.name,
      weekday: this.data.dayArray[this.data.daySelected].value as UserFavoritesDtoWeekdayEnum,
      ksjc: this.data.ksjc + 1,
      jsjc: this.data.jsjc + 1,
      place: this.data.place,
      color: this.data.colorArrar[this.data.colorSelected],
      remark,
    })
    wx.navigateBack({ delta: 1 })
  }
})