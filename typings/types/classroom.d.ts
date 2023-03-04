interface ClassInfo extends Record<string, any> {
  /**
   * 标题
   */
  readonly title: string
  /**
   * 课程占用
   */
  readonly KCZYFLAG?: boolean
  /**
   * 本科生考试
   */
  readonly BKSKSZYFLAG?: boolean
  /**
   * 普通教室借用占用
   */
  readonly PTJYZYFLAG?: boolean
  /**
   * 屏蔽占用
   */
  readonly PBZYFLAG?: boolean
  /**
   * 课程占用
   */
  readonly FBKSPKZYFLAG?: boolean
  /**
     * 开课单位
   */
  readonly KKDW?: string
  /**
   * 上课教师
   */
  readonly SKJS?: string
  /**
   * 课程名称
   */
  readonly KCMC?: string
  /**
   * 选课人数
   */
  readonly XKRS?: number
  /**
   * 行政班
   */
  readonly XZB?: string
  /**
   * 借用单位
   */
  readonly JYDW?: string
  /**
   * 借用人姓名
   */
  readonly JYRXM?: string
  /**
   * 负责老师
   */
  readonly FZLS?: string
  /**
   * 联系人电话
   */
  readonly LXDH?: string
  /**
   * 借用说明
   */
  readonly JYYTMS?: string
  /**
   * 上课人数
   */
  readonly SKRS?: number
  /**
   *
   */
  readonly PKLY?: string
}

interface TimetableBar extends Record<string, any> {
  /**
   * 教学楼名称
   */
  readonly jxlmc?: string
  /**
   * 教室门牌号
   */
  readonly jsmph?: string
  /**
   * 上课座位数
   */
  readonly skzws?: number
  /**
   * 星期几
   */
  readonly weekday: 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat'
  /**
   * 开始节次
   */
  readonly jcKs: number
  /**
   * 结束节次
   */
  readonly jcJs: number
  /**
   * 资源类型代码
   */
  readonly zylxdm?: '00' | '01' | '02' | '04' | '05' | '10'
  /**
   * 借用用途说明
   */
  readonly jyytms?: string
  /**
   * 课程名
   */
  readonly kcm?: string
  /**
   * 标题
   */
  title?: string
  /**
   * 用途
   */
  usage?: 'empty' | 'class' | 'others'
  /**
   * 
   */
  left?: number
}
