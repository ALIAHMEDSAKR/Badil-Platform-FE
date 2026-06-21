import { useCallback, useState } from 'react'

const STORAGE_KEY = 'badil_saved_listings'

function loadSaved(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as string[])
  } catch {
    return new Set()
  }
}

function persistSaved(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

export function useSavedListings() {
  const [savedIds, setSavedIds] = useState<Set<string>>(loadSaved)

  const toggleSave = useCallback((id: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      persistSaved(next)
      return next
    })
  }, [])

  const isSaved = useCallback((id: string) => savedIds.has(id), [savedIds])

  return { savedIds, toggleSave, isSaved }
}
