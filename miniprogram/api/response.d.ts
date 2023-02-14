interface IJsonResponse<TResponseData = any> {
  readonly status: number
  readonly message?: string
  readonly data?: TResponseData
}

interface IPageResult<TResponseData = any> {
  readonly page: number
  readonly size: number
  readonly pageCount: number
  readonly totalCount: number
  readonly list: Array<TResponseData>
}
