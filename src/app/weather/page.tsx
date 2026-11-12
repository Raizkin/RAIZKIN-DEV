
"use client"

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react"
import {
  ArrowLeft, ArrowRight, Cloud, CloudFog, CloudLightning, CloudRain,
  CloudSnow, CloudSun, Droplets, Gauge, LoaderCircle, MapPin, MoonStar,
  RefreshCw, Search, Sparkles, Sun, Sunrise, Sunset, Thermometer,
  Umbrella, Wind, X,
} from "lucide-react"

type Language = "uk" | "en"
type Unit = "C" | "F"

type City = {
  id: string
  name: string
  country: string
  admin1?: string
  latitude: number
  longitude: number
}

type Forecast = {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    wind_speed_10m: number
    weather_code: number
    is_day: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    weather_code: number[]
  }
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
    weather_code: number[]
    sunrise: string[]
    sunset: string[]
    uv_index_max: number[]
  }
}

type Preset = City & {
  uk: string
  en: string
  countryUk: string
  countryEn: string
}

const PRESETS: Preset[] = [
  {
    id: "kyiv",
    name: "Kyiv",
    uk: "Київ",
    en: "Kyiv",
    country: "Ukraine",
    countryUk: "Україна",
    countryEn: "Ukraine",
    latitude: 50.4501,
    longitude: 30.5234,
  },
  {
    id: "lviv",
    name: "Lviv",
    uk: "Львів",
    en: "Lviv",
    country: "Ukraine",
    countryUk: "Україна",
    countryEn: "Ukraine",
    latitude: 49.8397,
    longitude: 24.0297,
  },
  {
    id: "odesa",
    name: "Odesa",
    uk: "Одеса",
    en: "Odesa",
    country: "Ukraine",
    countryUk: "Україна",
    countryEn: "Ukraine",
    latitude: 46.4825,
    longitude: 30.7233,
  },
  {
    id: "london",
    name: "London",
    uk: "Лондон",
    en: "London",
    country: "United Kingdom",
    countryUk: "Велика Британія",
    countryEn: "United Kingdom",
    latitude: 51.5085,
    longitude: -0.1257,
  },
  {
    id: "prague",
    name: "Prague",
    uk: "Прага",
    en: "Prague",
    country: "Czechia",
    countryUk: "Чехія",
    countryEn: "Czechia",
    latitude: 50.088,
    longitude: 14.4208,
  },
]

const TEXT = {
  en: {
    back: "Back to portfolio",
    live: "LIVE DATA",
    headline: "WEATHER",
    suffix: ".LIVE",
    eyebrow: "RAIZKIN.DEV / EXPERIMENT 03",
    intro: "A little forecast, a lot of atmosphere. Explore real weather around the world.",
    find: "Find a location",
    help: "Type in English or Ukrainian and choose a city.",
    placeholder: "Kyiv, Львів, London...",
    search: "Search city",
    searching: "Searching...",
    noCity: "No matching cities. Try another spelling.",
    quick: "Quick destinations",
    powered: "Built with real data",
    poweredSub: "Weather information from Open-Meteo.",
    forecast: "Your forecast",
    current: "Current conditions",
    updated: "Updated",
    local: "local time",
    loading: "Loading forecast...",
    fail: "Could not load the forecast. Please try again.",
    searchFail: "Could not find a city. Check your internet connection.",
    retry: "Retry",
    feels: "Feels like",
    humidity: "Humidity",
    wind: "Wind speed",
    rain: "Rain chance",
    hoursLabel: "THE NEXT 12 HOURS",
    hours: "Hourly forecast",
    swipe: "Swipe horizontally to see more →",
    weekLabel: "THE WEEK AHEAD",
    week: "7-day forecast",
    today: "Today",
    sunrise: "Sunrise",
    sunset: "Sunset",
    uv: "Today's UV peak",
    footer: "Weather project",
    data: "Weather data by",
    weather: [
      "Clear sky", "Mainly clear", "Partly cloudy",
      "Overcast", "Foggy", "Drizzle", "Rain",
      "Snow", "Rain showers", "Snow showers",
      "Thunderstorm", "Cloudy",
    ],
  },
  uk: {
    back: "Повернутися до портфоліо",
    live: "АКТУАЛЬНІ ДАНІ",
    headline: "ПОГОДА",
    suffix: ".LIVE",
    eyebrow: "RAIZKIN.DEV / ПРОЄКТ 03",
    intro: "Погода з атмосферою. Дізнавайся прогноз у будь-якому куточку світу.",
    find: "Знайти місто",
    help: "Пиши українською або англійською й обирай місто з підказок.",
    placeholder: "Київ, Львів, London...",
    search: "Пошук міста",
    searching: "Шукаємо...",
    noCity: "Місто не знайдено. Спробуй іншу назву.",
    quick: "Популярні міста",
    powered: "Справжні погодні дані",
    poweredSub: "Інформація про погоду від Open-Meteo.",
    forecast: "Прогноз для міста",
    current: "Погода зараз",
    updated: "Оновлено",
    local: "за місцевим часом",
    loading: "Завантажуємо прогноз...",
    fail: "Не вдалося завантажити погоду. Спробуй ще раз.",
    searchFail: "Не вдалося знайти місто. Перевір інтернет-з'єднання.",
    retry: "Повторити",
    feels: "Відчувається як",
    humidity: "Вологість",
    wind: "Швидкість вітру",
    rain: "Імовірність опадів",
    hoursLabel: "НАСТУПНІ 12 ГОДИН",
    hours: "Погодинний прогноз",
    swipe: "Гортай убік, щоб побачити більше →",
    weekLabel: "ПРОГНОЗ НА ТИЖДЕНЬ",
    week: "Прогноз на 7 днів",
    today: "Сьогодні",
    sunrise: "Схід сонця",
    sunset: "Захід сонця",
    uv: "Максимальний УФ-індекс",
    footer: "Погодний проєкт",
    data: "Дані про погоду від",
    weather: [
      "Ясно", "Переважно ясно", "Мінлива хмарність",
      "Хмарно", "Туман", "Мряка", "Дощ",
      "Сніг", "Зливи", "Снігопад",
      "Гроза", "Хмарно",
    ],
  },
} as const

const WEATHER_FIELDS = {
  current:
    "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day",
  hourly:
    "temperature_2m,precipitation_probability,weather_code",
  daily:
    "temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,sunrise,sunset,uv_index_max",
}

function conditionIndex(code: number) {
  if (code === 0) return 0
  if (code === 1) return 1
  if (code === 2) return 2
  if (code === 3) return 3
  if (code === 45 || code === 48) return 4
  if (code >= 51 && code <= 57) return 5
  if (code >= 61 && code <= 67) return 6
  if (code >= 71 && code <= 77) return 7
  if (code >= 80 && code <= 82) return 8
  if (code >= 85 && code <= 86) return 9
  if (code >= 95) return 10
  return 11
}

function WeatherIcon({
  code,
  day = true,
  size = 32,
}: {
  code: number
  day?: boolean
  size?: number
}) {
  const index = conditionIndex(code)

  const Icon =
    index === 10
      ? CloudLightning
      : index === 7 || index === 9
        ? CloudSnow
        : [5, 6, 8].includes(index)
          ? CloudRain
          : index === 4
            ? CloudFog
            : index === 3
              ? Cloud
              : index === 1 || index === 2
                ? CloudSun
                : day
                  ? Sun
                  : MoonStar

  return (
    <Icon size={size} strokeWidth={1.5} aria-hidden="true" />
  )
}

function asTemp(n: number, unit: Unit) {
  return `${Math.round(unit === "C" ? n : n * 1.8 + 32)}°`
}

function asTime(s: string) {
  return s.split("T")[1]?.slice(0, 5) || "—"
}

function asDay(
  date: string,
  locale: Language,
  short = false
) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(
    locale === "uk" ? "uk-UA" : "en-GB",
    {
      weekday: short ? "short" : "long",
      ...(short
        ? {}
        : { day: "numeric", month: "long" }),
    }
  )
}

const LETTERS: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g",
  д: "d", е: "e", є: "ie", ж: "zh", з: "z",
  и: "y", і: "i", ї: "i", й: "i", к: "k",
  л: "l", м: "m", н: "n", о: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "kh", ц: "ts", ч: "ch", ш: "sh",
  щ: "shch", ь: "", ю: "iu", я: "ia",
  ё: "io", ы: "y", э: "e", ъ: "",
  ʼ: "", '"': "",
}

function toLatin(value: string) {
  return value
    .toLowerCase()
    .split("")
    .map(ch => LETTERS[ch] ?? ch)
    .join("")
    .replace(/^ia/, "ya")
    .replace(/^iu/, "yu")
    .replace(/^ie/, "ye")
}

function localMatches(value: string): City[] {
  const needle = value.toLocaleLowerCase().trim()

  if (needle.length < 2) return []

  return PRESETS.filter(
    p =>
      p.uk.toLocaleLowerCase().startsWith(needle) ||
      p.en.toLowerCase().startsWith(needle)
  )
}

function uniqueCities(values: City[]) {
  const map = new Map<string, City>()

  for (const city of values) {
    const key =
      `${city.latitude.toFixed(3)}:${city.longitude.toFixed(3)}`

    if (!map.has(key)) {
      map.set(key, city)
    }
  }

  return [...map.values()].slice(0, 8)
}

async function findCities(
  input: string,
  language: Language,
  signal: AbortSignal
): Promise<City[]> {
  const options = [input]

  if (/[а-яіїєґ]/i.test(input)) {
    const transliterated = toLatin(input)

    if (transliterated !== input.toLowerCase()) {
      options.push(transliterated)
    }
  }

  for (const name of options) {
    const params = new URLSearchParams({
      name,
      count: "8",
      language,
      format: "json",
    })

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params}`,
      { signal }
    )

    if (!response.ok) continue

    const data = await response.json()

    const found = (data.results || [])
      .filter(
        (x: { latitude?: number; longitude?: number }) =>
          typeof x.latitude === "number" &&
          typeof x.longitude === "number"
      )
      .map(
        (x: {
          id: number
          name: string
          country?: string
          admin1?: string
          latitude: number
          longitude: number
        }) => ({
          id: String(x.id),
          name: x.name,
          country: x.country || "",
          admin1: x.admin1,
          latitude: x.latitude,
          longitude: x.longitude,
        } satisfies City)
      )

    if (found.length) return found
  }

  return []
}

function cityDisplay(city: City, language: Language) {
  const preset = PRESETS.find(p => p.id === city.id)

  return preset
    ? language === "uk"
      ? preset.uk
      : preset.en
    : city.name
}

function countryDisplay(city: City, language: Language) {
  const preset = PRESETS.find(p => p.id === city.id)

  return preset
    ? language === "uk"
      ? preset.countryUk
      : preset.countryEn
    : city.country
}

export default function WeatherPage() {
  const [language, setLanguage] =
    useState<Language>("en")

  const [unit, setUnit] = useState<Unit>("C")

  const [city, setCity] =
    useState<City>(PRESETS[0])

  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] =
    useState<City[]>([])

  const [listOpen, setListOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [searching, setSearching] = useState(false)

  const [forecast, setForecast] =
    useState<Forecast | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchError, setSearchError] = useState("")
  const [reload, setReload] = useState(0)

  const cache = useRef(new Map<string, City[]>())
  const t = TEXT[language]

  useEffect(() => {
    try {
      setLanguage(
        localStorage.getItem("raizkin-site-language") === "uk"
          ? "uk"
          : "en"
      )
    } catch {
      // Storage not available.
    }
  }, [])

  function switchLanguage(next: Language) {
    setLanguage(next)

    try {
      localStorage.setItem(
        "raizkin-site-language",
        next
      )
    } catch {
      // Ignore storage failures.
    }
  }

  useEffect(() => {
    const controller = new AbortController()

    async function loadForecast() {
      setLoading(true)
      setError("")

      const params = new URLSearchParams({
        latitude: String(city.latitude),
        longitude: String(city.longitude),
        current: WEATHER_FIELDS.current,
        hourly: WEATHER_FIELDS.hourly,
        daily: WEATHER_FIELDS.daily,
        forecast_days: "7",
        timezone: "auto",
      })

      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?${params}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error("Forecast unavailable")
        }

        const result = await response.json() as Forecast

        if (
          !result.current ||
          !result.hourly ||
          !result.daily
        ) {
          throw new Error("Incomplete forecast")
        }

        if (!controller.signal.aborted) {
          setForecast(result)
        }
      } catch {
        if (!controller.signal.aborted) {
          setForecast(null)
          setError("forecast")
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void loadForecast()

    return () => controller.abort()
  }, [city, reload])

  useEffect(() => {
    const value = query.trim()
    const local = localMatches(value)

    setSuggestions(local)
    setSelectedIndex(0)
    setSearchError("")

    if (value.length < 3) {
      setSearching(false)
      return
    }

    const key = `${language}:${value.toLocaleLowerCase()}`

    if (cache.current.has(key)) {
      setSuggestions(
        uniqueCities([
          ...local,
          ...(cache.current.get(key) || []),
        ])
      )
      setSearching(false)
      return
    }

    const controller = new AbortController()

    const timeout = setTimeout(async () => {
      setSearching(true)

      try {
        const remote = await findCities(
          value,
          language,
          controller.signal
        )

        if (controller.signal.aborted) return

        cache.current.set(key, remote)
        setSuggestions(uniqueCities([...local, ...remote]))
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions(local)
        }
      } finally {
        if (!controller.signal.aborted) {
          setSearching(false)
        }
      }
    }, 380)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [query, language])

  function chooseCity(next: City) {
    setCity(next)
    setQuery("")
    setSuggestions([])
    setListOpen(false)
    setSearchError("")
  }

  async function submitSearch(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    if (suggestions.length) {
      chooseCity(
        suggestions[selectedIndex] || suggestions[0]
      )
      return
    }

    if (query.trim().length < 2) return

    setSearching(true)

    const controller = new AbortController()

    try {
      const results = await findCities(
        query.trim(),
        language,
        controller.signal
      )

      if (results.length) {
        chooseCity(results[0])
      } else {
        setSearchError("notFound")
      }
    } catch {
      setSearchError("search")
    } finally {
      setSearching(false)
    }
  }

  function inputKeyDown(
    event: KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Escape") {
      setListOpen(false)
      return
    }

    if (!listOpen || !suggestions.length) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      setSelectedIndex(
        i => (i + 1) % suggestions.length
      )
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      setSelectedIndex(
        i => (i - 1 + suggestions.length) %
          suggestions.length
      )
    }
  }

  const isDay = forecast?.current.is_day === 1

  const hourStart = forecast
    ? Math.max(
        0,
        forecast.hourly.time.findIndex(
          value =>
            value.slice(0, 13) >=
            forecast.current.time.slice(0, 13)
        )
      )
    : 0

  const hours = forecast
    ? forecast.hourly.time
        .slice(hourStart, hourStart + 12)
        .map((time, k) => {
          const i = hourStart + k

          return {
            time,
            temperature:
              forecast.hourly.temperature_2m[i],
            rain:
              forecast.hourly.precipitation_probability[i],
            code:
              forecast.hourly.weather_code[i],
          }
        })
    : []

  const stats = forecast
    ? [
        {
          label: t.feels,
          value: asTemp(
            forecast.current.apparent_temperature,
            unit
          ),
          Icon: Thermometer,
          color: "text-cyan-300",
        },
        {
          label: t.humidity,
          value:
            `${forecast.current.relative_humidity_2m}%`,
          Icon: Droplets,
          color: "text-sky-300",
        },
        {
          label: t.wind,
          value:
            `${Math.round(forecast.current.wind_speed_10m)} km/h`,
          Icon: Wind,
          color: "text-violet-300",
        },
        {
          label: t.rain,
          value: `${hours[0]?.rain ?? 0}%`,
          Icon: Umbrella,
          color: "text-blue-300",
        },
      ]
    : []

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070b15] text-white selection:bg-cyan-300/30">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="weather-orb absolute -left-60 top-20 h-[520px] w-[520px] rounded-full bg-cyan-500/[0.07] blur-[110px]" />
        <div className="weather-orb absolute -right-56 top-[400px] h-[560px] w-[560px] rounded-full bg-indigo-500/[0.08] blur-[130px]" />
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-7 sm:px-8 lg:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <a
            href="/#projects"
            className="group inline-flex items-center gap-3 text-sm font-semibold text-slate-300 transition hover:text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] transition group-hover:border-cyan-400/40 group-hover:bg-cyan-400/10">
              <ArrowLeft size={18} />
            </span>
            {t.back}
          </a>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-xs font-medium tracking-[0.14em] text-cyan-300 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              {t.live}
            </span>

            <div
              className="flex rounded-xl border border-white/10 bg-white/[0.05] p-1"
              aria-label="Language"
            >
              {(["uk", "en"] as const).map(next => (
                <button
                  key={next}
                  type="button"
                  onClick={() => switchLanguage(next)}
                  aria-pressed={language === next}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    language === next
                      ? "bg-white text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {next.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex rounded-xl border border-white/10 bg-white/[0.05] p-1">
              {(["C", "F"] as const).map(next => (
                <button
                  key={next}
                  type="button"
                  onClick={() => setUnit(next)}
                  aria-pressed={unit === next}
                  className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                    unit === next
                      ? "bg-cyan-300 text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  °{next}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="weather-enter my-10 sm:my-14">
          <div className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-cyan-300">
            <Sparkles size={15} />
            {t.eyebrow}
          </div>

          <h1 className="max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
            {t.headline}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
              {t.suffix}
            </span>
          </h1>

          <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            {t.intro}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[330px_minmax(0,1fr)]">
          <aside className="weather-enter rounded-[28px] border border-white/10 bg-[#101827]/90 p-5 sm:p-6">
            <h2 className="text-lg font-bold">
              {t.find}
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              {t.help}
            </p>

            <div
              className="relative mt-6"
              onBlur={event => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget
                  )
                ) {
                  setListOpen(false)
                }
              }}
            >
              <form
                onSubmit={submitSearch}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#080e1b] p-2 transition focus-within:border-cyan-300/60"
              >
                <Search
                  className="ml-2 shrink-0 text-slate-500"
                  size={19}
                />

                <input
                  value={query}
                  onChange={event => {
                    setQuery(event.target.value)
                    setListOpen(true)
                  }}
                  onFocus={() => setListOpen(true)}
                  onKeyDown={inputKeyDown}
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={
                    listOpen && suggestions.length > 0
                  }
                  aria-controls="weather-city-options"
                  aria-autocomplete="list"
                  aria-activedescendant={
                    listOpen && suggestions.length
                      ? `weather-option-${selectedIndex}`
                      : undefined
                  }
                  aria-label={t.search}
                  placeholder={t.placeholder}
                  className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm text-white outline-none placeholder:text-slate-500"
                />

                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("")
                      setSuggestions([])
                    }}
                    aria-label="Clear search"
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={17} />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={
                    searching ||
                    query.trim().length < 2
                  }
                  aria-label={t.search}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300 text-slate-950 transition hover:bg-cyan-200 disabled:opacity-50"
                >
                  {searching ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <ArrowRight size={19} />
                  )}
                </button>
              </form>

              {listOpen && query.trim().length >= 2 && (
                <div
                  id="weather-city-options"
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-72 overflow-y-auto rounded-2xl border border-white/15 bg-[#19273c] p-2 shadow-2xl shadow-black/70"
                >
                  {suggestions.map((next, index) => (
                    <button
                      key={`${next.id}-${index}`}
                      id={`weather-option-${index}`}
                      role="option"
                      aria-selected={
                        selectedIndex === index
                      }
                      type="button"
                      onMouseDown={event =>
                        event.preventDefault()
                      }
                      onClick={() => chooseCity(next)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                        selectedIndex === index
                          ? "bg-cyan-300/15 text-white"
                          : "text-slate-200 hover:bg-white/10"
                      }`}
                    >
                      <MapPin
                        size={16}
                        className="shrink-0 text-cyan-300"
                      />

                      <span className="min-w-0">
                        <span className="block truncate font-semibold">
                          {cityDisplay(next, language)}
                        </span>

                        <span className="block truncate text-xs text-slate-400">
                          {[
                            next.admin1,
                            countryDisplay(next, language),
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </span>
                    </button>
                  ))}

                  {searching && (
                    <p className="px-3 py-3 text-xs text-slate-400">
                      {t.searching}
                    </p>
                  )}

                  {!searching &&
                    !suggestions.length && (
                      <p className="px-3 py-3 text-xs text-slate-400">
                        {t.noCity}
                      </p>
                    )}
                </div>
              )}
            </div>

            {searchError && (
              <p
                role="alert"
                className="mt-3 text-sm text-rose-300"
              >
                {searchError === "notFound"
                  ? t.noCity
                  : t.searchFail}
              </p>
            )}

            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
              {t.quick}
            </p>

            <div className="mt-3 flex flex-wrap gap-2 lg:flex-col">
              {PRESETS.filter(p =>
                ["kyiv", "lviv", "london", "prague"]
                  .includes(p.id)
              ).map(p => {
                const active = p.id === city.id

                return (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => chooseCity(p)}
                    aria-pressed={active}
                    className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                      active
                        ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200"
                        : "border-white/[0.06] bg-white/[0.035] text-slate-300 hover:border-white/20 hover:bg-white/[0.07]"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin size={16} />
                      {cityDisplay(p, language)}
                    </span>

                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4">
              <p className="text-sm font-semibold text-slate-200">
                {t.powered}
              </p>

              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {t.poweredSub}
              </p>
            </div>
          </aside>

          <div className="space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-2xl border border-rose-400/30 bg-rose-400/10 p-5 text-sm text-rose-200"
              >
                {t.fail}

                <button
                  type="button"
                  onClick={() =>
                    setReload(n => n + 1)
                  }
                  className="ml-3 inline-flex items-center gap-1 font-bold underline"
                >
                  <RefreshCw size={14} />
                  {t.retry}
                </button>
              </div>
            )}

            {loading && (
              <div className="flex min-h-[380px] items-center justify-center gap-3 rounded-[30px] border border-white/10 bg-white/[0.035] text-slate-400">
                <LoaderCircle
                  size={25}
                  className="animate-spin text-cyan-300"
                />
                {t.loading}
              </div>
            )}

            {!loading && forecast && (
              <>
                <section
                  className={`weather-enter relative isolate overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br ${
                    isDay
                      ? "from-[#15445c] via-[#102d4a] to-[#151b3b]"
                      : "from-[#19264c] via-[#111e38] to-[#201a40]"
                  } p-7 sm:p-9`}
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                  >
                    <div className="weather-orb absolute -right-16 -top-24 h-72 w-72 rounded-full border-[50px] border-cyan-200/10" />
                    <div className="weather-orb absolute -right-12 top-12 h-44 w-44 rounded-full bg-cyan-300/10 blur-2xl" />
                    <div className="absolute -bottom-36 left-1/3 h-64 w-64 rounded-full bg-violet-400/10 blur-[75px]" />
                  </div>

                  <div className="relative">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-200">
                          <MapPin size={15} />
                          {t.forecast}
                        </p>

                        <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                          {cityDisplay(city, language)}
                        </h2>

                        <p className="mt-1 text-sm text-slate-300">
                          {countryDisplay(city, language)}
                          {" · "}
                          {asDay(
                            forecast.current.time.slice(0, 10),
                            language
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setReload(n => n + 1)
                        }
                        aria-label={t.retry}
                        className="rounded-xl border border-white/15 bg-white/10 p-2.5 text-slate-100 transition hover:bg-white/20"
                      >
                        <RefreshCw size={18} />
                      </button>
                    </div>

                    <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-200">
                          {t.current}
                        </p>

                        <div className="mt-1 text-[clamp(5rem,10vw,8rem)] font-black leading-none tracking-[-0.08em]">
                          {asTemp(
                            forecast.current.temperature_2m,
                            unit
                          )}
                        </div>

                        <p className="mt-4 text-xl font-medium text-slate-100">
                          {t.weather[
                            conditionIndex(
                              forecast.current.weather_code
                            )
                          ]}
                        </p>

                        <p className="mt-2 text-xs text-slate-300">
                          {t.updated}
                          {" "}
                          {asTime(forecast.current.time)}
                          {" "}
                          {t.local}
                        </p>
                      </div>

                      <div className="weather-float flex h-32 w-32 items-center justify-center rounded-full bg-white/10 text-cyan-100 shadow-[0_0_90px_rgba(103,232,249,.15)] backdrop-blur-lg sm:h-40 sm:w-40">
                        <WeatherIcon
                          code={forecast.current.weather_code}
                          day={isDay}
                          size={88}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {stats.map(
                    ({ label, value, Icon, color }) => (
                      <div
                        key={label}
                        className="weather-enter rounded-2xl border border-white/10 bg-[#111827]/90 p-4 transition duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-5"
                      >
                        <Icon size={23} className={color} />
                        <p className="mt-5 text-xs text-slate-400">
                          {label}
                        </p>
                        <p className="mt-1 text-lg font-bold sm:text-xl">
                          {value}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {!loading && forecast && (
          <>
            <section className="weather-enter mt-6 rounded-[28px] border border-white/10 bg-[#101827]/85 p-6 sm:p-8">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
                    {t.hoursLabel}
                  </p>
                  <h2 className="mt-2 text-2xl font-black">
                    {t.hours}
                  </h2>
                </div>

                <span className="text-xs text-slate-500">
                  {t.swipe}
                </span>
              </div>

              <div className="overflow-x-auto pb-2">
                <div className="grid min-w-[850px] grid-cols-12 gap-2">
                  {hours.map(hour => (
                    <div
                      key={hour.time}
                      className="rounded-2xl border border-white/[0.06] bg-white/[0.035] px-2 py-5 text-center transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.07]"
                    >
                      <p className="text-xs text-slate-400">
                        {asTime(hour.time)}
                      </p>

                      <div className="my-4 flex justify-center text-cyan-200">
                        <WeatherIcon
                          code={hour.code}
                          size={27}
                        />
                      </div>

                      <p className="text-xl font-black">
                        {asTemp(hour.temperature, unit)}
                      </p>

                      <p className="mt-3 flex items-center justify-center gap-1 text-[11px] text-sky-300">
                        <Droplets size={12} />
                        {hour.rain}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="weather-enter mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_310px]">
              <div className="rounded-[28px] border border-white/10 bg-[#101827]/85 p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-cyan-300">
                  {t.weekLabel}
                </p>

                <h2 className="mb-6 mt-2 text-2xl font-black">
                  {t.week}
                </h2>

                <div className="space-y-2">
                  {forecast.daily.time.map((date, i) => (
                    <div
                      key={date}
                      className="grid grid-cols-[minmax(60px,1fr)_36px_60px_auto] items-center gap-2 rounded-xl bg-white/[0.025] px-3 py-3 transition hover:bg-white/[0.055] sm:grid-cols-[minmax(85px,1fr)_48px_minmax(110px,1fr)_75px_auto] sm:gap-3"
                    >
                      <span className="font-medium">
                        {i === 0
                          ? t.today
                          : asDay(date, language, true)}
                      </span>

                      <span className="text-cyan-200">
                        <WeatherIcon
                          code={forecast.daily.weather_code[i]}
                          size={28}
                        />
                      </span>

                      <span className="hidden text-sm text-slate-400 sm:block">
                        {t.weather[
                          conditionIndex(
                            forecast.daily.weather_code[i]
                          )
                        ]}
                      </span>

                      <span className="flex items-center gap-1 text-xs text-sky-300">
                        <Droplets size={13} />
                        {forecast.daily.precipitation_probability_max[i]}%
                      </span>

                      <span className="whitespace-nowrap text-right font-bold">
                        {asTemp(
                          forecast.daily.temperature_2m_max[i],
                          unit
                        )}

                        <span className="ml-1 text-slate-500">
                          {asTemp(
                            forecast.daily.temperature_2m_min[i],
                            unit
                          )}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  {
                    label: t.sunrise,
                    value: asTime(forecast.daily.sunrise[0]),
                    Icon: Sunrise,
                    color: "text-amber-200",
                  },
                  {
                    label: t.sunset,
                    value: asTime(forecast.daily.sunset[0]),
                    Icon: Sunset,
                    color: "text-orange-300",
                  },
                  {
                    label: t.uv,
                    value:
                      forecast.daily.uv_index_max[0]?.toFixed(1) ??
                      "—",
                    Icon: Gauge,
                    color: "text-violet-300",
                  },
                ].map(({ label, value, Icon, color }) => (
                  <div
                    key={label}
                    className="rounded-[26px] border border-white/10 bg-[#101827]/85 p-6"
                  >
                    <div
                      className={`flex items-center gap-2 ${color}`}
                    >
                      <Icon size={21} />
                      <span className="text-sm font-medium text-slate-400">
                        {label}
                      </span>
                    </div>

                    <p className="mt-4 text-3xl font-black">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        <footer className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500">
          <span>
            © RAIZKIN.DEV · {t.footer}
          </span>

          <span>
            {t.data}
            {" "}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 underline underline-offset-4"
            >
              Open-Meteo
            </a>
            {" · CC BY 4.0"}
          </span>
        </footer>
      </div>

      <style>{`
        @keyframes weatherEnter {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes weatherFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-9px);
          }
        }

        @keyframes weatherOrb {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(12px, 14px, 0);
          }
        }

        .weather-enter {
          animation: weatherEnter .65s ease both;
        }

        .weather-float {
          animation: weatherFloat 5s ease-in-out infinite;
        }

        .weather-orb {
          animation: weatherOrb 12s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .weather-enter,
          .weather-float,
          .weather-orb {
            animation: none;
          }
        }
      `}</style>
    </main>
  )
}
