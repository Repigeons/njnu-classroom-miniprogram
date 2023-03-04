interface IComponent {
  tap?: (e: WechatMiniprogram.CustomEvent) => any,
  longpress?: (e: WechatMiniprogram.CustomEvent) => any,
}

interface IButton extends IComponent {
  readonly text: string,
}

interface TimetableDetailDialog extends Record<string, any> {
  readonly title: any
  readonly detail: Array<{
    readonly field: string
    readonly value: string
  }>
}

interface KeyValue<T> {
  readonly key: string
  readonly value: T
}

interface IPosition {
  rangeKey?: string
  readonly name: string
  readonly position: {
    readonly 0: number
    readonly 1: number
  }
  readonly distance?: number
  readonly number?: number
}
