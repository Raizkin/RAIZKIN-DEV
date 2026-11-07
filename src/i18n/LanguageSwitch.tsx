"use client"
import { useI18n } from "./LocaleProvider"

/** UI-only content is translated; language selection is semantic and keyboard accessible. */
export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n()
  return (
    <div className={`inline-flex shrink-0 items-center gap-0.5 rounded-full border border-white/15 bg-black/70 p-1 backdrop-blur-xl ${className}`}
      role="group" aria-label={t.misc.languageAria}>
      {(["uk", "en"] as const).map((lang) => (
        <button key={lang} type="button" onClick={() => setLocale(lang)}
          aria-pressed={locale === lang} lang={lang}
          className={`rounded-full px-2.5 py-1.5 text-xs font-semibold transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 ${locale === lang ? "bg-white text-neutral-950" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}>
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
