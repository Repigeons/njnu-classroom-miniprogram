// components/grids/grids.js
const navigatorDefault: IGridNavigator = {
  target: 'self',
  openType: 'navigate',
  url: '.',
  delta: 1,
  appId: '',
  path: '',
  extraData: '',
  version: 'release',
  hoverStopPropagation: false,
  hoverStartTime: 50,
  hoverStayTime: 600,
  method: ''
}
const buttonDefault: IGridButton = {
  openType: '',
  sessionFrom: '',
  sendMessageTitle: '',
  sendMessagePath: '',
  sendMessageImg: '',
  appParameter: '',
  showMessageCard: false,
}

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    grids: { type: Array },
    column: { type: Number },
  },

  /**
   * 组件的初始数据
   */
  data: {
    width: '',
    innerGrids: Array<Grid>()
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGridTap(e: WechatMiniprogram.CustomEvent) {
      this.triggerEvent('tapgrids', { 'method': e.currentTarget.dataset.method })
    }
  },
  lifetimes: {
    ready() {
      this.setData({
        width: `calc(${100.0 / this.data.column}% - 8px)`
      })
    }
  },
  observers: {
    grids(grids: Array<Grid>) {
      this.setData({
        innerGrids: grids.map((grid: Grid) => {
          grid.button = grid.button ? (<any>Object).assign({}, buttonDefault, grid.button) : grid.button
          return (<any>Object).assign({}, navigatorDefault, grid)
        })
      })
    }
  }
})
