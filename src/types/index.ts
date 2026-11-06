export type StorageType = 'local' | 'session'

/**  useSearchHistory のオプション */
export interface UseSearchHistoryOptions<T = string> {
  /**
   * ストレージに保存するキーの接頭辞。
   * @default "rhsh:"
   */
  prefix?: string
  /**
   * 複数の検索履歴を区別するためのキー。あるいはストレージに保存するキーの接尾辞。
   * @default ""
   */
  key?: string
  /**
   * 検索履歴に保存する最大クエリの数。
   * @default 5
   */
  maxEntries?: number
  /**
   * 検索履歴を保存する先のストレージの種類。
   * @default "local"
   */
  storageType?: StorageType
  /**
   * 検索履歴の重複判定を行う比較関数。重複している場合は `true` を返します。`void` は `false` として扱います。
   * @default (a, b) => a === b
   */
  dedupeFn?: (a: T, b: T) => boolean | void
  /**
   * 履歴に追加するか否かを決定する関数。追加を無視する場合は `true` を返します。`void` は `false` として扱います。
   * @default (query) => (typeof query === 'string' && query.trim().length === 0)
   */
  ignoreFn?: (query: T) => boolean | void
}
