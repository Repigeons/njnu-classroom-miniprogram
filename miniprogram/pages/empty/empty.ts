// empty
import { cachedCoreQueryBuildingsJson } from '../../utils/cacheable'
import { getDistance, getJc } from '../../utils/util'
import { weekdays } from '../../utils/constant'
import { coreApi, EmptyClassroomFeedbackDtoWeekdayEnum, EmptyClassroomVo, exploreApi, PositionVo, UserFavoritesDtoWeekdayEnum } from '../../apis/api'

const feedbackInterval: number = 5000 // 间隔时间（毫秒）

Page({
  data: {
    // 筛选
    jxlArray: Array<PositionVo>(),
    jxlSelected: 0,
    jxlScroll: 0,
    rqArray: weekdays,
    rqSelected: 0,
    rqScroll: 0,
    jcSelected: 0,
    jcScroll: 0,
    // 结果
    result: Array<EmptyClassroomVo>(),
    // 反馈
    layer_index: 0,
    layer_display: false,
    confirm_display: false,
    layer_buttons: Array<IButton>(),
    confirm_buttons: Array<IButton>(),
    feedbackTime: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   * 生成教学楼名（仅用于列表显示）
   */
  onLoad(options: Record<string, string>) {
    this.preloadInfo()
    // 上报错误
    this.setData({
      layer_buttons: [{
        text: '加入收藏',
        tap: this.addFavorites
      }, {
        text: '反馈错误',
        tap: () => this.setData({
          layer_display: false,
          confirm_display: true,
        })
      }],
      confirm_buttons: [{
        text: '提交',
        tap: this.feedback
      }, {
        text: '取消',
        tap: () => this.setData({ confirm_display: false })
      }],
    })

    if (options.page === 'empty') {
      // always true
    }
  },

  async preloadInfo() {
    // 加载教学楼位置
    const coreQueryBuildingsJson = await cachedCoreQueryBuildingsJson()
    this.setData({ jxlArray: coreQueryBuildingsJson ? coreQueryBuildingsJson : [] })
    // 初始化至当前状态
    this.dangqianriqi()
    this.dangqianjieci()
    this.dingwei()
  },

  /**
   * 生命周期函数--监听页面显示
   * 每次显示时重置状态
   */
  onShow() {
    this.hideLayer()
  },

  /**
   * 获取当前定位并选择最近的教学楼
   */
  async dingwei() {
    const res = await wx.getLocation({
      type: 'gcj02'
    }) as any as WechatMiniprogram.GetLocationSuccessCallbackResult
    let minIndex: number = 0
    let minDistance: number = 0xffffffff
    this.data.jxlArray.forEach((jxl, index) => {
      const distance: number = getDistance({
        latitude1: jxl.latitude,
        longitude1: jxl.longitude,
        longitude2: res.longitude,
        latitude2: res.latitude,
      })
      if (minDistance > distance) {
        minDistance = distance
        minIndex = index
      }
    })
    this.setData({
      jxlSelected: minIndex,
      jxlScroll: minIndex,
    })
    this.submit()
  },
  /**
   * 将选择的日期设为当天
   */
  dangqianriqi() {
    const rq = (new Date().getDay() + 6) % 7
    this.setData({
      rqSelected: rq,
      rqScroll: rq,
    })
    this.submit()
  },
  /**
   * 将选择的课程节次设为当前节次
   */
  dangqianjieci() {
    const jc = getJc(new Date())
    this.setData({
      jcSelected: jc,
      jcScroll: jc,
    })
    this.submit()
  },

  /**
   * 选择教学楼
   */
  bindJxlChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({ jxlSelected: +e.detail.value })
    this.submit()
  },
  /**
   * 选择日期
   */
  bindRqChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({ rqSelected: +e.detail.value })
    this.submit()
  },
  /**
   * 选择节次
   */
  bindJcChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({ jcSelected: +e.detail.value })
    this.submit()
  },

  /**
   * 提交请求至服务器，更新显示的数据
   */
  async submit() {
    try {
      const result = await coreApi.getEmpty(
        this.data.jxlArray[this.data.jxlSelected].name,
        this.data.rqArray[this.data.rqSelected].key,
        `${this.data.jcSelected + 1}`,
      )
      console.debug("empty", result)
      this.setData({ result })
    } catch {
      this.setData({ result: [] })
    }
  },
  /**
   * 添加收藏
   */
  async addFavorites() {
    this.hideLayer()
    const jxlmc = this.data.jxlArray[this.data.jxlSelected].name
    const weekday = this.data.rqArray[this.data.rqSelected].key
    const item = this.data.result[this.data.layer_index]
    const dto = {
      title: ' ',
      weekday: weekday as UserFavoritesDtoWeekdayEnum,
      ksjc: item.ksjc,
      jsjc: item.jsjc,
      place: `${jxlmc}${item.jsmph}`,
      color: '#ace5ac',
      remark: {}
    }
    await exploreApi.saveFavorites(dto)
    wx.showToast({ title: '添加收藏成功' })
  },

  /**
   * 反馈错误
   */
  async feedback() {
    this.hideLayer()
    this.setData({ confirm_display: false })
    const rq = (new Date().getDay() + 6) % 7
    const jc = getJc(new Date())
    if (this.data.rqSelected !== rq || this.data.jcSelected !== jc) {
      wx.showToast({
        title: '未选择当前星期或节次',
        icon: 'none'
      })
      this.dangqianriqi()
      this.dangqianjieci()
      return
    }

    const now: number = new Date().getTime()
    if (now < this.data.feedbackTime + feedbackInterval) {
      wx.showToast({
        title: '操作过于频繁',
        icon: 'loading',
        duration: 500
      })
      return
    }
    wx.showToast({
      title: '发送中',
      icon: 'loading'
    })
    await coreApi.feedbackEmptyClassroom({
      jc: this.data.jcSelected + 1,
      results: this.data.result,
      index: this.data.layer_index,
      weekday: this.data.rqArray[this.data.rqSelected].key as EmptyClassroomFeedbackDtoWeekdayEnum,
      jxlmc: this.data.jxlArray[this.data.jxlSelected].name,
    })
    wx.hideToast({
      complete() {
        wx.showToast({
          title: '发送成功',
          icon: 'success'
        })
      }
    })
    this.setData({
      feedbackTime: new Date().getTime()
    })
  },

  /**
   * 显示用户反馈弹出层
   */
  showLayer(e: WechatMiniprogram.CustomEvent) {
    const index: number = e.currentTarget.dataset.index
    this.setData({
      layer_index: index,
      layer_display: true
    })
  },
  /**
   * 隐藏用户反馈弹出层
   */
  hideLayer(e?: WechatMiniprogram.CustomEvent) {
    const layer = e?.target.id === 'layer'
    if (!layer) {
      this.setData({
        layer_display: false,
        confirm_display: false,
      })
    }
  },

  onShareAppMessage() {
    return {
      title: '空教室查询',
      path: 'pages/empty/empty'
        + `?page=empty`,
      image: 'images/logo.png'
    }
  }
})
