"use client"
import { profile } from "@/data/raizkin"
import { useI18n } from "@/i18n/LocaleProvider"

import { useRef, useState, type FormEvent, type InputHTMLAttributes } from "react"
import { ArrowUp, CheckCircle2, ChevronDown, Github, Loader2, Mail, Send } from "lucide-react"
import { gsap, useGSAP, SplitText, ScrollTrigger, MOTION_OK, scrollToTarget } from "@/lib/gsap"
import { EMAIL, socials } from "@/data/portfolio"
import { cn, asset } from "@/lib/utils"
import { Magnetic } from "./Magnetic"

export function Contact() {
  const { t } = useI18n()
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MOTION_OK, () => {
        const title = SplitText.create(".contact-title", { type: "chars", mask: "chars" })

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 65%" } })
          .from(title.chars, {
            yPercent: 120,
            rotate: 10,
            stagger: { each: 0.035, from: "center" },
            duration: 1.1,
            ease: "expo.out",
          })
          .from(".contact-underline", { drawSVG: "0%", duration: 1.4, ease: "power2.inOut" }, 0.5)
          .from(".contact-copy > *", { y: 30, autoAlpha: 0, stagger: 0.12, duration: 1 }, 0.4)
          .from(".contact-cta", { y: 50, autoAlpha: 0, duration: 1.1, ease: "expo.out" }, 0.7)
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="contact" className="relative px-6 py-10 md:py-14">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.4em] text-purple-400">{t.contact.eyebrow}</p>
        <div className="relative mb-12 inline-block">
          <h2 className="contact-title text-5xl font-bold tracking-tight md:text-8xl">{t.contact.heading}</h2>
          <svg
            className="absolute -bottom-4 left-0 w-full"
            viewBox="0 0 400 20"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="underline-grad" x1="0" x2="1">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="50%" stopColor="#34d399" />
                <stop offset="100%" stopColor="#a3e635" />
              </linearGradient>
            </defs>
            <path
              className="contact-underline"
              d="M2 14 C 60 4, 120 18, 200 10 S 340 4, 398 12"
              stroke="url(#underline-grad)"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="contact-copy space-y-6 text-lg leading-relaxed text-gray-300 md:text-xl">
{t.contact.intro.map((paragraph,i)=><p key={i}>{paragraph}</p>)}
</div>

        <div className="contact-cta mt-14">
          {/* TELEGRAM-CONTACT-V2: edit URLs and QR in site.config.json, not JSX. */}
          <div className="mx-auto mb-8 grid max-w-2xl items-center gap-6 rounded-3xl border border-emerald-400/20 bg-neutral-900/90 p-6 text-left shadow-xl sm:grid-cols-[1fr_148px] md:p-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">{t.contact.direct}</p>
              <h3 className="mt-3 text-2xl font-semibold">{t.contact.telegramTitle} · @{profile.contact.telegramHandle}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-400">{t.contact.telegramDescription}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={profile.contact.telegram} target="_blank" rel="noopener noreferrer" className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-1">{t.contact.openTelegram}</a>
                <a href={socials.email} className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-emerald-400">{t.contact.emailLink}</a>
              </div>
            </div>
            <a href={profile.contact.telegram} target="_blank" rel="noopener noreferrer" aria-label={`${t.contact.openTelegram} @${profile.contact.telegramHandle}`} className="mx-auto block rounded-2xl bg-white p-2 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(profile.contact.qr)} width={140} height={140} loading="lazy" alt={`${t.contact.qrAria} @${profile.contact.telegramHandle}`} className="h-auto w-[140px] rounded-lg" />
            </a>
          </div>
          {EMAIL ? <EnquiryForm /> : (
            <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-neutral-900 p-10 text-center">
              <p className="mb-4 text-xl font-semibold">{t.contact.unavailableTitle}</p>
              <p className="mb-6 text-gray-400">{t.contact.unavailableText}</p>
              <a className="inline-flex rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3 text-white" href={profile.contact.telegram} target="_blank" rel="noreferrer">{t.contact.openTelegram}</a>
            </div>
          )}
          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm leading-none text-gray-500">
            <span>{t.contact.preferEmail}</span>
            <a
              href={EMAIL ? socials.email : socials.github}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-4 py-2.5 leading-none text-gray-200 transition-colors hover:border-purple-400/60 hover:text-purple-400"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              {EMAIL}
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}


// The public Web3Forms access key is configured in .env.local (not hardcoded in JSX).
const FORM_ENDPOINT = "https://api.web3forms.com/submit"
const REQUEST_TIMEOUT_MS = 15_000

type Status = "idle" | "sending" | "sent" | "error"

const FIELD =
  "w-full rounded-xl border border-white/15 bg-neutral-950 px-4 text-base text-white outline-none transition-[border-color,box-shadow] placeholder:text-gray-500 focus:border-purple-400 focus:ring-4 focus:ring-purple-400/15"

/** A labelled text input; every field is required unless it says otherwise. */
function Field({ label, className, ...props }: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-sm font-medium text-gray-200">
        {label} <span className="text-red-400" aria-hidden="true">*</span>
      </span>
      <input required className={cn(FIELD, "h-12")} {...props} />
    </label>
  )
}

function EnquiryForm() {
  const { t } = useI18n()
  const [type, setType] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const somethingElse = type === t.contact.topics[t.contact.topics.length - 1].value

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data._honey) return // bots fill hidden fields; humans don't

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY?.trim()
    if (!accessKey) {
      setErrorMessage(t.contact.missingKey)
      setStatus("error")
      return
    }

    setErrorMessage("")
    setStatus("sending")
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          access_key: accessKey,
          from_name: profile.brand,
          subject: `${profile.brand}: ${type} — ${String(data.firstName)} ${String(data.lastName)}`,
          email: String(data.email),
          first_name: String(data.firstName),
          last_name: String(data.lastName),
          enquiry_type: type,
          message: String(data.notes || "—"),
        }),
      })

      const json: { success?: boolean; message?: string } = await res.json()
      if (!res.ok || json.success !== true) {
        throw new Error(json.message || `Web3Forms returned HTTP ${res.status}`)
      }

      form.reset()
      setType(null)
      setStatus("sent")
    } catch (error) {
      const message =
        error instanceof Error && error.name === "AbortError"
          ? t.contact.timeout
          : error instanceof Error && error.message
            ? error.message
            : t.contact.error
      setErrorMessage(message)
      setStatus("error")
    } finally {
      window.clearTimeout(timeout)
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-neutral-900 p-10 shadow-2xl shadow-black/20">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-purple-400" />
        <p className="text-2xl font-semibold">{t.contact.sentTitle}</p>
        <p className="mt-2 text-gray-400">{t.contact.sentDescription}</p>
        <button onClick={() => setStatus("idle")} className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-purple-400 hover:text-pink-400">
          {t.contact.again}
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative mx-auto max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 p-6 text-left shadow-2xl shadow-black/20 md:p-10"
    >
      {/* gradient hairline across the top edge */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400" />

      <div className="mb-8 border-b border-white/10 pb-6">
        <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">{t.contact.formTitle}</h3>
        <p className="mt-2 text-base text-gray-400">
          {t.contact.formSubtitle}
        </p>
      </div>

      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.contact.firstName} name="firstName" autoComplete="given-name" placeholder={t.contact.firstPlaceholder} />
        <Field label={t.contact.lastName} name="lastName" autoComplete="family-name" placeholder={t.contact.lastPlaceholder} />
        <Field label={t.contact.email} name="email" type="email" autoComplete="email" placeholder={t.contact.emailPlaceholder} className="sm:col-span-2" />
      </div>

      <label className="mt-5 block">
        <span className="mb-2 block text-sm font-medium text-gray-200">
          {t.contact.topic} <span className="text-red-400" aria-hidden="true">*</span>
        </span>
        <span className="relative block">
          <select
            name="enquiryType"
            required
            value={type ?? ""}
            onChange={(e) => setType(e.target.value || null)}
            className={cn(FIELD, "h-12 cursor-pointer appearance-none pr-11", !type && "text-gray-500")}
          >
            <option value="" disabled>
              {t.contact.choose}
            </option>
            {t.contact.topics.map((option) => (
              <option key={option.value} value={option.value} className="bg-neutral-900 text-white">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </label>

      <label className="mt-7 block">
        <span className="mb-2 flex items-baseline justify-between gap-4 text-sm font-medium text-gray-200">
          <span>
            {t.contact.message} {somethingElse && <span className="text-red-400" aria-hidden="true">*</span>}
          </span>
          <span className="text-xs font-normal text-gray-500">{somethingElse ? t.contact.required : t.contact.optional}</span>
        </span>
        <textarea
          name="notes"
          rows={5}
          required={somethingElse}
          placeholder={somethingElse ? t.contact.messageRequiredPlaceholder : t.contact.messagePlaceholder}
          className={cn(FIELD, "resize-y py-3 leading-relaxed")}
        />
      </label>

      <div className="mt-8 flex flex-col-reverse gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm">
          {status === "error" ? (
            <p role="alert" className="text-red-400">
              {errorMessage || t.contact.error}
            </p>
          ) : (
            <p className="text-gray-500">{t.contact.privacy}</p>
          )}
        </div>
        <Magnetic strength={0.3}>
          <button
            type="submit"
            disabled={status === "sending"}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-3.5 text-base font-semibold text-[#fff] shadow-lg shadow-purple-500/25 transition-shadow hover:shadow-purple-500/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-400 disabled:opacity-60 sm:w-auto"
          >
            {status === "sending" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            {status === "sending" ? t.contact.sending : t.contact.submit}
          </button>
        </Magnetic>
      </div>
    </form>
  )
}

export function Footer() {
  const { t } = useI18n()
  return (
    <footer className="relative border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-sm text-gray-400">© {new Date().getFullYear()} {profile.name}. {t.misc.rights}</p>
        <div className="flex items-center gap-6">
          {<a href={profile.contact.telegram} target="_blank" rel="noreferrer" aria-label="Telegram" className="text-gray-400 transition-colors hover:text-blue-400">
            <Send className="h-5 w-5" />
          </a>}
          <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-gray-400 transition-colors hover:text-purple-400">
            <Github className="h-5 w-5" />
          </a>
          {EMAIL && <a href={socials.email} aria-label="Email" className="text-gray-400 transition-colors hover:text-pink-400">
            <Mail className="h-5 w-5" />
          </a>}
        </div>
      </div>
    </footer>
  )
}

export function BackToTop() {
  const { t } = useI18n()
  const ref = useRef<HTMLButtonElement>(null)

  useGSAP(() => {
    const show = gsap
      .timeline({ paused: true })
      .fromTo(ref.current, { autoAlpha: 0, scale: 0, rotate: -180 }, { autoAlpha: 1, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2)" })

    ScrollTrigger.create({
      start: 600,
      end: "max",
      onEnter: () => show.play(),
      onLeaveBack: () => show.reverse(),
    })
  })

  return (
    <button
      ref={ref}
      onClick={() => scrollToTarget(0)}
      className="invisible fixed bottom-8 right-8 z-40 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 text-[#fff] shadow-lg"
      aria-label={t.misc.top}
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  )
}
