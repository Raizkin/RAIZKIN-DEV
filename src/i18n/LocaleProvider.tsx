"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { DEFAULT_LOCALE, dictionaries, LOCALE_KEY, type Locale } from "./messages"

type I18nContextValue = {
  locale: Locale
  setLocale: (next: Locale) => void
  t: (typeof dictionaries)[Locale]
}

const Context = createContext<I18nContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  // Identical first render on server and client => no hydration mismatch.
  const [locale, saveLocale] = useState<Locale>(DEFAULT_LOCALE)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const previous = localStorage.getItem(LOCALE_KEY)
      if (previous === "uk" || previous === "en") saveLocale(previous)
    } catch { /* Storage can be disabled. */ }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    document.documentElement.lang = locale
    try { localStorage.setItem(LOCALE_KEY, locale) } catch { /* Ignore private-mode storage errors. */ }
  }, [locale, hydrated])

  const setLocale = useCallback((next: Locale) => saveLocale(next), [])
  const value = useMemo(() => ({ locale, setLocale, t: dictionaries[locale] }), [locale, setLocale])

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useI18n() {
  const ctx = useContext(Context)
  if (!ctx) throw new Error("useI18n must be rendered within LocaleProvider")
  return ctx
}
