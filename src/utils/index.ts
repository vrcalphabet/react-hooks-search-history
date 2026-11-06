import { ERROR_PREFIX } from '../constants'
import type { StorageType } from '../types'

export function getStorage(type: StorageType) {
  if (!globalThis.window) return
  return type === 'local' ? window.localStorage : window.sessionStorage
}

export function getStorageItem<T>(type: StorageType, key: string) {
  try {
    const value = getStorage(type)?.getItem(key) ?? undefined
    return (value === undefined ? [] : JSON.parse(value)) as T[]
  } catch (e) {
    console.error(`${ERROR_PREFIX}Failed to load search history from storage`, e)
  }
}

export function setStorageItem(type: StorageType, key: string, value: unknown) {
  try {
    getStorage(type)?.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    console.error(`${ERROR_PREFIX}Failed to save search query`, e)
    return false
  }
}

export function removeStorageItem(type: StorageType, key: string) {
  try {
    getStorage(type)?.removeItem(key)
    return true
  } catch (e) {
    console.error(`${ERROR_PREFIX}Failed to clear search history`, e)
    return false
  }
}
