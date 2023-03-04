import { postExploreUserFavorites } from "../../../../../api/index"

// pages/explore/pages/favorites/appender/appender.ts
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dayArray: [
      { label: '周一', value: 'Mon' },
      { label: '周二', value: 'Tue' },
      { label: '周三', value: 'Wen' },
      { label: '周四', value: 'Thu' },
      { label: '周五', value: 'Fri' },
      { label: '周六', value: 'Sat' },
      { label: '周日', value: 'Sun' },
    ],
    daySelected: 0,
    jcArray: [
      { label: '第1节' }, { label: '第2节' }, { label: '第3节' }, { label: '第4节' },
      { label: '第5节' }, { label: '第6节' }, { label: '第7节' }, { label: '第8节' },
      { label: '第9节' }, { label: '第10节' }, { label: '第11节' }, { label: '第12节' },
    ],
    jcKs: 0,
    jcJs: 0,
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
    let [daySelected, jcKs, jcJs] = e.detail.value
    if (jcKs > jcJs) {
      const tmp = jcKs
      jcKs = jcJs
      jcJs = tmp
    }
    this.setData({ daySelected, jcKs, jcJs })
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
    await postExploreUserFavorites({
      title: this.data.name,
      weekday: this.data.dayArray[this.data.daySelected].value as "Mon" | "Tue" | "Thu" | "Fri" | "Sat" | "Sun" | "Wed",
      jcKs: this.data.jcKs + 1,
      jcJs: this.data.jcJs + 1,
      place: this.data.place,
      color: this.data.colorArrar[this.data.colorSelected],
      remark,
    })
    wx.navigateBack({ delta: 1 })
  }
})