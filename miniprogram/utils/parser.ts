import { weekdays } from "./constant"

export function parseKcm(zylxdm: string, kcm: string): ClassInfo | null {
  let kcxx: Array<string>
  const pklysz: Record<string, string> = { '01': '研', '02': '成', '03': '本', '04': '借', '05': '本考', '11': '研考', '12': '成教' }
  switch (zylxdm) {
    case '01':
    case '03':
      // 课程占用
      kcxx = kcm.replace(/%%/g, ',').split("#")
      return {
        KCZYFLAG: true,
        // 开课单位
        KKDW: kcxx[0] ? kcxx[0] : '',
        // 上课教师
        SKJS: kcxx[1] ? kcxx[1] : '',
        // 课程名称
        KCMC: kcxx[2] ? kcxx[2] : '',
        // 选课人数
        XKRS: kcxx[3] ? +kcxx[3] : 0,
        // 行政班
        XZB: kcxx[4] ? kcxx[4] : '',
        //
        title: kcxx[2] ? kcxx[2] : '未知',
      }
    case '02':
      // 本科生考试
      return {
        BKSKSZYFLAG: true,
        //
        PKLY: pklysz['05'],
        //
        title: kcm,
      }
    case '04':
      // 普通教室借用占用
      kcxx = kcm.split("#")
      return {
        PTJYZYFLAG: true,
        // 借用单位
        JYDW: kcxx[0] ? kcxx[0] : '',
        // 借用人姓名
        JYRXM: kcxx[1] ? kcxx[1] : '',
        // 负责老师
        FZLS: kcxx[2] ? kcxx[2] : '',
        // 联系人电话
        LXDH: kcxx[3] ? kcxx[3] : '',
        // 借用说明
        JYYTMS: kcxx[4] ? kcxx[4] : '',
        //
        PKLY: pklysz['04'],
        //
        title: kcxx[4] ? kcxx[4] : '未知',
      }
    case '05':
      // 屏蔽占用
      return {
        title: '教室资源屏蔽',
        PBZYFLAG: true,
      }
    case '10':
    case '11':
      // 课程占用
      kcxx = kcm.split("#")
      return {
        FBKSPKZYFLAG: true,
        // 课程名称
        KCMC: kcxx[0] ? kcxx[0] : '',
        // 上课教师
        SKJS: kcxx[1] ? kcxx[1] : '',
        // 上课人数
        SKRS: kcxx[2] ? +kcxx[2] : 0,
        // 借用单位
        JYDW: kcxx[3] ? kcxx[3] : '',
        // 借用人姓名
        JYRXM: kcxx[4] ? kcxx[4] : '',
        // 负责老师
        FZLS: kcxx[5] ? kcxx[5] : '',
        // 联系电话
        LXDH: kcxx[6] ? kcxx[6] : '',
        //
        PKLY: pklysz[kcxx[7]],
        //
        title: kcxx[0] ? kcxx[0] : '未知',
      }
    default:
      return null
  }
}

export function classDetailItem2dialog(item: Record<string, any>): TimetableDetailDialog {
  const weekday = weekdays.find(it => it.key === item.weekday)?.value
  const jsmp = { field: '教室门牌', value: `${item.jxlmc}${item.jsmph}` }
  const detail: Array<{
    field: string;
    value: string;
  }> = [{
    field: item.usage === 'empty' ? '空闲时间' : '使用时间',
    value: `${weekday ? weekday : ''}${item.ksjc}-${item.jsjc}节`
  }]
  if (item.KCMC) detail.push({ field: '课程名称', value: item.KCMC })
  if (item.SKJS) detail.push({ field: '上课教师', value: item.SKJS })
  if (item.KKDW) detail.push({ field: '开课单位', value: item.KKDW })
  if (item.XKRS) detail.push({ field: '选课人数', value: item.XKRS })
  if (item.SKRS) detail.push({ field: '上课人数', value: item.SKRS })
  // if (item.XZB) detail.push({ field: '行政班级', value: item.XZB })
  if (item.JYDW) detail.push({ field: '借用单位', value: item.JYDW })
  if (item.JYRXM) detail.push({ field: '借用人姓名', value: item.JYRXM })
  if (item.FZLS) detail.push({ field: '负责老师', value: item.FZLS })
  // if (item.LXDH) detail.push({ field: '联系电话', value: item.LXDH })
  if (item.jyytms) detail.push({ field: '借用说明', value: item.jyytms })
  const remark: Record<string, any> = {}
  detail.forEach(it => remark[it.field] = it.value)
  const dto = {
    remark,
    title: item.title,
    weekday: item.weekday,
    ksjc: item.ksjc,
    jsjc: item.jsjc,
    place: `${item.jxlmc}${item.jsmph}`,
    color: item.usage === 'empty'
      ? '#ace5ac' : item.usage === 'class'
        ? '#9ac8ed' : '#f2c7aa',
  }
  detail.unshift(jsmp)
  return { detail, title: item.title, dto }
}

export function parseTime(str: string): number {
  const arr = str.split(':')
  if (arr.length !== 2) {
    return NaN
  }
  const time_arr = arr.map(s => +s)
  if (time_arr[0] < 0 || time_arr[0] >= 24) {
    return NaN
  }
  if (time_arr[1] < 0 || time_arr[1] >= 60) {
    return NaN
  }
  return time_arr[0] * 60 + time_arr[1]
}

export function userFavoritesItem2dialog(item: Record<string, any>): TimetableDetailDialog {
  const detail: Array<{
    field: string;
    value: string;
  }> = [{
    field: '地 点', value: item.place
  }]
  for (let field in item.remark) {
    detail.push({ field, value: item.remark[field] })
  }
  return { detail, title: item.title, itemId: item.id }
}
