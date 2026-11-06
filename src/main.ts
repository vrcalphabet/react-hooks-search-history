import { useCallback, useEffect, useRef, useState } from 'react'
import type { UseSearchHistoryOptions } from './types'
import { getStorageItem, removeStorageItem, setStorageItem } from './utils'

/** 保存した検索履歴を削除します。 */
export function clearSearchHistory(
  opts: Pick<UseSearchHistoryOptions, 'prefix' | 'key' | 'storageType'>,
) {
  const storageKey = `${opts.prefix ?? 'rhsh:'}${opts.key ?? ''}`
  const storageType = opts.storageType ?? 'local'
  removeStorageItem(storageType, storageKey)

  if (typeof BroadcastChannel === 'undefined') return
  const channel = new BroadcastChannel(`rhsh-channel:${storageKey}`)
  channel.postMessage(null)
}

/** 検索履歴をストレージで管理するためのカスタムフック */
export function useSearchHistory<T = string>(opts: UseSearchHistoryOptions<T> = {}) {
  const storageKey = `${opts.prefix ?? 'rhsh:'}${opts.key ?? ''}`
  const storageType = opts.storageType ?? 'local'
  const maxEntries = opts.maxEntries ?? 5
  const dedupeFn = opts.dedupeFn ?? ((a, b) => a === b)
  const ignoreFn =
    opts.ignoreFn ?? ((query) => typeof query === 'string' && query.trim().length === 0)

  const channelRef = useRef<BroadcastChannel>(null)

  const removeValue = (arr: T[], value: T) => {
    return arr.filter((v) => !dedupeFn(v, value))
  }

  const [history, setHistory] = useState<T[]>([])

  useEffect(() => {
    const load = () => {
      const value = getStorageItem<T>(storageType, storageKey)
      if (!value) return
      setHistory(value.slice(0, maxEntries))
    }
    load()

    const channel = new BroadcastChannel(`rhsh-channel:${storageKey}`)
    channel.addEventListener('message', load)
    channelRef.current = channel

    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [storageKey, storageType, maxEntries])

  const notify = () => channelRef.current?.postMessage(null)

  /**
   * 検索履歴にクエリを追加します。
   * @param query 追加するクエリ
   */
  const addQuery = useCallback((query: T) => {
    if (ignoreFn(query)) return

    setHistory((prev) => {
      const nextHistory = [query, ...removeValue(prev, query)].slice(0, maxEntries)
      const success = setStorageItem(storageType, storageKey, nextHistory)
      if (success) notify()
      return success ? nextHistory : prev
    })
  }, [])

  /**
   * 検索履歴からクエリを削除します。
   * @param query 削除するクエリ
   */
  const removeQuery = useCallback((query: T) => {
    setHistory((prev) => {
      const nextHistory = removeValue(prev, query)
      const success = setStorageItem(storageType, storageKey, nextHistory)
      if (success) notify()
      return success ? nextHistory : prev
    })
  }, [])

  /**
   * 検索履歴をクリアします。
   */
  const clearHistory = useCallback(() => {
    setHistory((prev) => {
      const success = removeStorageItem(storageType, storageKey)
      if (success) notify()
      return success ? [] : prev
    })
  }, [])

  return {
    history,
    addQuery,
    removeQuery,
    clearHistory,
  }
}
