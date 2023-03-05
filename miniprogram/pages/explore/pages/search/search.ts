// explore/search
import { weekdays } from "../../../../utils/constant"
import { GetCoreQueryClassroomsJsonResponse, getCoreQuerySearch, GetCoreQueryZylxdmJsonResponse } from "../../../../api/index"
import { cachedCoreQueryClassroomsJson, cachedCoreQueryZylxdmJson } from "../../../../utils/cacheable"
import { classDetailItem2dialog, parseKcm } from "../../../../utils/parser"

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 搜索
    keyword: String(),
    showSearch: Boolean(),
    showResult: Boolean(),
    // 筛选
    jxlArray: [{ key: '', value: "不限" }] as Array<KeyValue<string>>,
    jxlSelected: 0,
    rqArray: [{ key: '', value: "不限" }] as Array<KeyValue<string>>,
    rqMapper: Object() as Record<string, string>,
    rqSelected: 0,
    jcArray: ['第1节', '第2节', '第3节', '第4节', '第5节', '第6节', '第7节', '第8节', '第9节', '第10节', '第11节', '第12节'],
    jcKsSelected: 0,
    jcJsSelected: 11,
    zylxdmArray: [{ key: '', value: "不限" }] as Array<KeyValue<string>>,
    zylxdmSelected: 0,
    // 结果
    pageNum: 0,
    pageCount: -1,
    totalCount: 0,
    result: Array(),
    dialog: { title: '', detail: [], dto: null } as TimetableDetailDialog
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.preloadInfo().then(() => {
      // 
      if (options.page === 'search') {
        const { keyword, jxlSelected, rqSelected, jcKsSelected, jcJsSelected, zylxdmSelected } = options
        this.setData({
          keyword: keyword ? keyword : '',
          jxlSelected: jxlSelected ? Number(jxlSelected) : 0,
          rqSelected: rqSelected ? Number(rqSelected) : 0,
          jcKsSelected: jcKsSelected ? Number(jcKsSelected) : 0,
          jcJsSelected: jcJsSelected ? Number(jcJsSelected) : 11,
          zylxdmSelected: zylxdmSelected ? Number(zylxdmSelected) : 0,
        })
        this.submit()
      }
    })
  },

  async preloadInfo() {
    const rqMapper = Object() as Record<string, string>
    weekdays.forEach(it => { rqMapper[it.key] = it.value })
    const zylxdmArray = await cachedCoreQueryZylxdmJson() as GetCoreQueryZylxdmJsonResponse
    const classrooms = await cachedCoreQueryClassroomsJson() as GetCoreQueryClassroomsJsonResponse
    const jxlArray = classrooms.map(it => ({ key: it.jxlmc, value: it.jxlmc }))
    this.setData({
      zylxdmArray: this.data.zylxdmArray.concat(zylxdmArray),
      jxlArray: this.data.jxlArray.concat(jxlArray),
      rqArray: this.data.rqArray.concat(weekdays),
      rqMapper,
    })
  },

  onFocus() {
    this.setData({
      showSearch: true,
      showResult: false,
    })
  },

  onInput(e: WechatMiniprogram.CustomEvent) {
    this.setData({ keyword: e.detail.value })
  },

  bindRqChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({ rqSelected: e.detail.value })
  },
  bindJxlChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({ jxlSelected: e.detail.value })
  },
  bindJcChange(e: WechatMiniprogram.CustomEvent) {
    const data: Record<string, string> = Object()
    data[e.target.dataset.jc] = e.detail.value
    this.setData(data)

    const { jcKsSelected, jcJsSelected } = this.data
    if (jcKsSelected > jcJsSelected) {
      this.setData({
        jcKsSelected: jcJsSelected,
        jcJsSelected: jcKsSelected,
      })
    }
  },
  bindZylxChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({ zylxdmSelected: e.detail.value })
  },

  async submit() {
    this.setData({ showSearch: false })
    if (!this.data.keyword) return
    this.setData({
      pageCount: -1,
      pageNum: 0,
      result: []
    })
    this.requestData()
  },

  async requestData() {
    this.data.pageNum += 1
    if (this.data.pageCount >= 0 && this.data.pageNum > this.data.pageCount)
      return
    try {
      const res = await getCoreQuerySearch({
        weekday: this.data.rqArray[this.data.rqSelected].key,
        jcKs: `${this.data.jcKsSelected + 1}`,
        jcJs: `${this.data.jcJsSelected + 1}`,
        jxlmc: this.data.jxlArray[this.data.jxlSelected].key,
        zylxdm: this.data.zylxdmArray[this.data.zylxdmSelected].key,
        keyword: this.data.keyword,
        page: `${this.data.pageNum}`
      })
      const list = []
      for (let i = 0; i < res.list.length; i++) {
        const item = res.list[i] as Record<string, any>
        const info = parseKcm(res.list[i].zylxdm, res.list[i].kcm)
        if (info === null) continue
        for (const k in info) {
          item[k] = info[k]
        }
        list.push(item)
      }
      this.setData({
        showResult: true,
        serve: true,
        totalCount: res.total,
        pageCount: res.totalPage,
        result: this.data.result.concat(list),
      })
    } catch {
      this.setData({
        serve: false,
        result: [],
      })
    }
  },

  onReachBottom() {
    this.requestData()
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
    return {
      title: '更多搜索',
      path: 'pages/explore/pages/search/search'
        + `?page=search`
        + `&keyword=${this.data.keyword}`
        + `&jxlSelected=${this.data.jxlSelected}`
        + `&rqSelected=${this.data.rqSelected}`
        + `&jcKsSelected=${this.data.jcKsSelected}`
        + `&jcJsSelected=${this.data.jcJsSelected}`
        + `&zylxdmSelected=${this.data.zylxdmSelected}`,
      image: 'images/logo.png'
    }
  }
})
