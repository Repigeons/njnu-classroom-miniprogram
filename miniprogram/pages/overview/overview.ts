// overview
import { ClassroomVo, coreApi } from '../../apis/api'
import { cachedCoreQueryClassroomsJson } from '../../utils/cacheable'
import { parseKcm, classDetailItem2dialog } from '../../utils/parser'
import { getJc } from '../../utils/util'

Page({
  data: {
    // 选择教室
    classrooms: Array<ClassroomVo>(),
    jxlmcList: Array<string>(),
    jxlSelected: 0,
    jxlSelectedBackup: 0,
    jsmphList: Array<string[]>(),
    jasSelected: 0,
    jasSelectedBackup: 0,
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
    dialog: { title: '', detail: [], dto: null } as TimetableDetailDialog
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: Record<string, string>) {
    const { windowHeight, windowWidth } = wx.getSystemInfoSync()
    const cellHeight = (windowHeight - (this.data.cell.top + 20 + 2)) / 13
    const cellWidth = (windowWidth - (this.data.cell.left * 2 + 2)) / 8 - 1
    this.setData({
      'cell.height': cellHeight,
      'cell.width': cellWidth,
      dqjc: getJc(new Date()),
    })
    this.preloadInfo().then(() => {
      //
      if (options.page === 'overview') {
        const { jxlmc, jsmph } = options
        this.switchClassroom(jxlmc, jsmph)
      }
    })
  },
  /**
   * 预加载教室信息
   */
  async preloadInfo() {
    const classrooms = await cachedCoreQueryClassroomsJson() as ClassroomVo[]
    this.setData({
      classrooms: classrooms,
      jxlmcList: classrooms.map(jxl => jxl.jxlmc),
      jsmphList: classrooms.map(jxl => jxl.list.map(jas => jas.jsmph!)),
    })
  },
  /**
   * 加载上次的教室
   */
  onShow() {
    wx.getStorage({
      key: 'latestOverview',
      success: res => {
        const { jxlmc, jsmph } = res.data
        this.switchClassroom(jxlmc, jsmph)
      },
      fail: () => {
        this.setData({ jxlSelected: 0, jasSelected: 0 })
        this.submit()
      }
    })
  },
  /**
   * 加载指定教室
   * @param jxlmc 教学楼名称
   * @param jsmph 教室门牌号
   */
  switchClassroom(jxlmc: string, jsmph: string) {
    const classrooms = this.data.classrooms
    let jxlSelected = classrooms.findIndex(jxl => jxl.jxlmc === jxlmc)
    if (jxlSelected === -1) jxlSelected = 0
    let jasSelected = classrooms[jxlSelected].list.findIndex(jas => jas.jsmph === jsmph)
    if (jasSelected === -1) jasSelected = 0
    this.setData({
      jxlSelected,
      jasSelected,
    })
    this.submit()
  },
  /**
   * 切换教室（临时）
   */
  onPickerChange(e: WechatMiniprogram.CustomEvent) {
    const { column, value } = e.detail
    if (column === 0) {
      this.setData({ jxlSelected: +value, jasSelected: 0 })
    } else {
      this.setData({ jasSelected: +value })
    }
  },
  /**
   * 取消切换教室
   */
  onPickerCancel() {
    this.setData({
      jxlSelected: this.data.jxlSelectedBackup,
      jasSelected: this.data.jasSelectedBackup,
    })
  },
  /**
   * 前一个教室
   */
  bindFormer() {
    if (this.data.jasSelected > 0) {
      this.setData({
        jasSelected: this.data.jasSelected - 1,
        jasSelectedBackup: this.data.jasSelected - 1,
      })
    } else if (this.data.jxlSelected > 0) {
      const jasListSize = this.data.classrooms[this.data.jxlSelected - 1].list.length
      this.setData({
        jxlSelected: this.data.jxlSelected - 1,
        jxlSelectedBackup: this.data.jxlSelected - 1,
        jasSelected: jasListSize - 1,
        jasSelectedBackup: jasListSize - 1,
      })
    } else {
      const jxlListSize = this.data.classrooms.length
      const jasListSize = this.data.classrooms[jxlListSize - 1].list.length
      this.setData({
        jxlSelected: jxlListSize - 1,
        jxlSelectedBackup: jxlListSize - 1,
        jasSelected: jasListSize - 1,
        jasSelectedBackup: jasListSize - 1,
      })
    }
    this.submit()
  },
  /**
   * 后一个教室
   */
  bindLatter() {
    const jasListSize = this.data.classrooms[this.data.jxlSelected].list.length
    if (this.data.jasSelected < jasListSize - 1) {
      this.setData({
        jasSelected: this.data.jasSelected + 1,
        jasSelectedBackup: this.data.jasSelected + 1,
      })
    } else if (this.data.jxlSelected < this.data.classrooms.length - 1) {
      this.setData({
        jxlSelected: this.data.jxlSelected + 1,
        jxlSelectedBackup: this.data.jxlSelected + 1,
        jasSelected: 0,
        jasSelectedBackup: 0,
      })
    } else {
      this.setData({
        jxlSelected: 0,
        jxlSelectedBackup: 0,
        jasSelected: 0,
        jasSelectedBackup: 0,
      })
    }
    this.submit()
  },
  /**
   * 查询该教室概览
   */
  async submit() {
    this.setData({
      jxlSelectedBackup: this.data.jxlSelected,
      jasSelectedBackup: this.data.jasSelected,
    })
    const jas = this.data.classrooms[this.data.jxlSelected].list[this.data.jasSelected]
    wx.setStorage({
      key: 'latestOverview',
      data: jas
    })
    const result = await coreApi.getOverview(jas.jasdm) as TimetableBar[]
    console.debug("overview", result)
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
      const item = result[i]
      switch (item.zylxdm) {
        case '00':
          item.usage = 'empty'
          item.title = ' '
          break;
        case '01':
        case '10':
          item.usage = 'class'
          break;
        default:
          item.usage = 'others'
          break;
      }
      if (dayMapper[item.weekday] + 1 === this.data.today) {
        if (item.ksjc <= this.data.dqjc + 1)
          if (item.jsjc >= this.data.dqjc + 1)
            this.setData({ idle: item.zylxdm === '00' })
      }
      item.left = dayMapper[item.weekday]
      const info = parseKcm(item.zylxdm as string, item.kcm as string)
      if (info === null) continue
      for (const k in info) {
        item[k] = info[k]
      }
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
    this.setData({ dialog: classDetailItem2dialog(item) })
  },

  onShareAppMessage() {
    const { jxlmc, jsmph } = this.data.classrooms[this.data.jxlSelected].list[this.data.jasSelected]
    return {
      title: '教室概览',
      path: 'pages/overview/overview'
        + `?page=overview`
        + `&jxlmc=${jxlmc}`
        + `&jsmph=${jsmph}`,
      image: 'images/logo.png'
    }
  }
})
