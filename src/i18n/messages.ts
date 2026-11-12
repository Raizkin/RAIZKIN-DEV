/**
 * RAIZKIN.DEV public content. Only translate human-facing copy.
 * Proper nouns, brand names, code identifiers and technology names live in profile.
 */
import { profile } from "@/data/raizkin"

const en = {
  nav: { about: "About", projects: "Projects", skills: "Skills", contact: "Contact", talk: "Let's talk", menu: "Menu", mainAria: "Main navigation", city: profile.city, openMenu: "Open menu", closeMenu: "Close menu" },
  hero: { greeting: "Hi, I'm", locationPrefix: "from", location: profile.location, country: profile.location, marquee: "CREATIVE DEVELOPER", cta: "Let's Talk", work: "View My Work", scrollAria: "Scroll to About", roles: [...profile.roles] },
  about: {
    eyebrow: "01 — WHO I AM", lead: "About", accent: "Me", compiled: "Compiled", compiling: "Compiling…", profileDescription: "Designs and builds for the web", locationLabel: "Location", strengths: "Strengths", stack: "Daily stack", end: "End of profile",
    paragraphs: [...profile.about],
    storyParagraph: profile.about[0],
    processTitles: ["Design", "Develop", "Deliver"],
    processDescriptions: [...profile.process],
    storyNames: ["about.ts", "Profile", "Toolkit", "My story", "How I work", "Motto"],
    storyHint: "One line of code at a time. Swipe to see what it renders →",
    storiesAria: "About me, in stories", localTime: "Local time", pause: "Pause stories", play: "Play stories", previous: "Previous story", next: "Next story", storyInstruction: "Swipe or tap the sides to move between stories. Press and hold to pause.",
    strengthsLabels: [...profile.strengths],
  },
  projects: {
    eyebrow: "02 — SELECTED WORK", lead: "My", accent: "Projects", intro: "A collection of projects showcasing web interfaces and community tools I've built.", scroll: "Scroll →", view: "View", live: "Live site", visit: "Visit", github: "on GitHub",
    descriptions: Object.fromEntries(profile.projects.map(p => [p.title, p.description])) as Record<string, string>,
  },
  skills: {
    eyebrow: "03 — TOOLKIT", lead: "My", accent: "Skills Galaxy", intro: "A dynamic blend of technologies and personal skills — orbiting around design, logic and creativity.",
    groups: { "Frontend": "Frontend", "Backend": "Backend", "Dev Tools": "Dev Tools", "App Development": "App Development", "Soft Skills": "Soft Skills" },
    softItems: { "Problem Solving": "Problem Solving", "Collaboration": "Collaboration", "Adaptability": "Adaptability", "Creativity": "Creativity", "Fast Learner": "Fast Learner" } as Record<string, string>,
    toolsCount: "tools in this orbit", peopleCount: "ways I work with people", tabAria: "Skill groups",
  },
  contact: {
    eyebrow: "04 — GET IN TOUCH", heading: "Let's Connect", intro: [...profile.about],
    direct: "DIRECT CONTACT", telegramTitle: "Telegram", telegramDescription: "Scan the QR code or open a direct chat. For detailed requests, use the email form below.", openTelegram: "Open Telegram ↗", emailLink: "Write an email ↗", qrAria: "Telegram QR code",
    unavailableTitle: "Contact me on Telegram", unavailableText: "The email form will be enabled after an address is configured.", preferEmail: "Prefer email?",
    formTitle: "Send me a message", formSubtitle: "Tell me a little about your project and I'll get back to you by email.",
    firstName: "First name", lastName: "Last name", email: "Email address", topic: "What can I help with?", choose: "Choose a topic…", message: "Message", required: "Required", optional: "Optional", messagePlaceholder: "A few words about your project, timeline or budget…", messageRequiredPlaceholder: "What can I help you with?",
    firstPlaceholder: "Jane", lastPlaceholder: "Smith", emailPlaceholder: "jane@company.com", submit: "Send message", sending: "Sending…",
    privacy: "Your details are only used to reply to you.", sentTitle: "Message received.", sentDescription: "Thanks for reaching out. I'll get back to you soon.", again: "Send another →",
    missingKey: "The contact form is not configured. Please contact me by email or Telegram.", timeout: "The request timed out. Check your connection and try again.", error: "Unable to send the message. Please try again or use Telegram.",
    topics: [
      { value: "Website Design & Development", label: "Website Design & Development" },
      { value: "UI/UX Design", label: "UI/UX Design" },
      { value: "Collaboration on Projects", label: "Collaboration on Projects" },
      { value: "Website Projects Implementation", label: "Website Projects Implementation" },
      { value: "Help with Personal Portfolio", label: "Help with Personal Portfolio" },
      { value: "Something else", label: "Something else" },
    ],
  },
  misc: { top: "Back to top", themeLight: "Switch to light theme", themeDark: "Switch to dark theme", lightMode: "Light mode", darkMode: "Dark mode", languageAria: "Website language", rights: "All rights reserved." },
}

// Widen literal values while retaining the same key structure in both dictionaries.
type WidenStrings<T> = T extends string ? string : T extends ReadonlyArray<infer U> ? WidenStrings<U>[] : T extends object ? { [K in keyof T]: WidenStrings<T[K]> } : T

const uk: WidenStrings<typeof en> = {
  nav: { about: "Про мене", projects: "Проєкти", skills: "Навички", contact: "Контакти", talk: "Зв'язатися", menu: "Меню", mainAria: "Головна навігація", city: "Київщина", openMenu: "Відкрити меню", closeMenu: "Закрити меню" },
  hero: { greeting: "Привіт, я", locationPrefix: "з", location: "України", country: "Україна", marquee: "КРЕАТИВНИЙ РОЗРОБНИК", cta: "Зв'язатися", work: "Мої роботи", scrollAria: "Перейти до розділу про мене", roles: ["Junior Front-End розробник", "React-розробник", "Розробник Discord-ботів", "Креативний Front-End розробник"] },
  about: {
    eyebrow: "01 — ХТО Я", lead: "Про", accent: "мене", compiled: "Скомпільовано", compiling: "Компіляція…", profileDescription: "Створюю дизайн та розробляю вебсайти", locationLabel: "Місце", strengths: "Сильні сторони", stack: "Технології", end: "Кінець профілю",
    paragraphs: [
      "Я Junior Front-End розробник з України. Створюю адаптивні інтерфейси та інтерактивні вебсайти з React і JavaScript.",
      "Розробляю сайти для шкіл і малого бізнесу, застосунки з API та Discord-ботів із заявками, ролями, журналами подій і модерацією.",
    ],
    storyParagraph: "Я Junior Front-End розробник з України. Люблю створювати зручні вебінтерфейси, React-застосунки й автоматизації для Discord-спільнот.",
    processTitles: ["Дизайн", "Розробка", "Результат"],
    processDescriptions: ["Зручні макети, багаторазові компоненти й адаптивний дизайн.", "React, JavaScript та API, а також Discord-автоматизації на Node.js.", "Ретельна перевірка, зрозуміла комунікація й практичний результат."],
    storyNames: ["about.ts", "Профіль", "Технології", "Моя історія", "Як я працюю", "Девіз"],
    storyHint: "Рядок за рядком створюється профіль. Гортай, щоб побачити результат →", storiesAria: "Про мене: історії", localTime: "Місцевий час", pause: "Зупинити історії", play: "Відтворити історії", previous: "Попередня історія", next: "Наступна історія", storyInstruction: "Гортай або натискай з боків для перемикання. Утримуй, щоб призупинити.",
    strengthsLabels: ["Front-End розробка", "UI-дизайн", "Discord-боти"],
  },
  projects: {
    eyebrow: "02 — ОБРАНІ РОБОТИ", lead: "Мої", accent: "проєкти", intro: "Добірка моїх вебінтерфейсів, застосунків та інструментів для спільнот.", scroll: "Гортай →", view: "Дивитися", live: "Відкрити сайт", visit: "Відкрити", github: "на GitHub",
    descriptions: {
      "Bohonos English School": "Адаптивний сайт школи англійської мови зі зручною структурою навчання, інформацією про заняття та продуманим дизайном.",
      "Euro Koshyk": "Каталог інтернет-магазину з категоріями товарів, багаторазовими картками, пошуком і фільтрацією.",
      "Weather Dashboard": "Погодний застосунок із пошуком міст, картками прогнозу та інтеграцією погодних і новинних API.",
      "Discord Bot Project": "Discord-боти для керування спільнотами: заявки, тікети, ролі, журнали подій і модерація.",
    },
  },
  skills: {
    eyebrow: "03 — ІНСТРУМЕНТИ", lead: "Моя", accent: "Галактика навичок", intro: "Технології й особисті навички, що обертаються навколо дизайну, логіки та творчості.",
    groups: { "Frontend": "Frontend", "Backend": "Backend", "Dev Tools": "Інструменти", "App Development": "Розробка застосунків", "Soft Skills": "Особисті навички" },
    softItems: { "Problem Solving": "Розв'язання проблем", "Collaboration": "Співпраця", "Adaptability": "Адаптивність", "Creativity": "Креативність", "Fast Learner": "Швидке навчання" },
    toolsCount: "інструментів на орбіті", peopleCount: "особистих навичок", tabAria: "Категорії навичок",
  },
  contact: {
    eyebrow: "04 — ЗВ'ЯЗОК", heading: "Зв'яжімося", intro: [
      "Я розробляю виразні адаптивні інтерфейси на React і сучасному JavaScript. Ціную продумані деталі та чистий код.",
      "Створюю сайти для шкіл і малого бізнесу, експериментую з інтерфейсами та розробляю Discord-ботів для онлайн-спільнот.",
    ],
    direct: "ПРЯМИЙ ЗВ'ЯЗОК", telegramTitle: "Telegram", telegramDescription: "Відскануй QR-код або відкрий чат. Для детальних запитів нижче є форма на email.", openTelegram: "Відкрити Telegram ↗", emailLink: "Написати на пошту ↗", qrAria: "QR-код Telegram",
    unavailableTitle: "Напиши мені в Telegram", unavailableText: "Форма на email запрацює після налаштування адреси.", preferEmail: "Зручніше поштою?",
    formTitle: "Напиши мені", formSubtitle: "Розкажи коротко про свій проєкт, і я відповім електронною поштою.",
    firstName: "Ім'я", lastName: "Прізвище", email: "Електронна пошта", topic: "З чим допомогти?", choose: "Обери тему…", message: "Повідомлення", required: "Обов'язково", optional: "Необов'язково", messagePlaceholder: "Кілька слів про проєкт, терміни або бюджет…", messageRequiredPlaceholder: "Чим я можу допомогти?",
    firstPlaceholder: "Олена", lastPlaceholder: "Петренко", emailPlaceholder: "olena@example.com", submit: "Надіслати", sending: "Надсилання…",
    privacy: "Використовую дані лише для відповіді на твоє звернення.", sentTitle: "Повідомлення надіслано.", sentDescription: "Дякую за звернення! Я відповім тобі найближчим часом.", again: "Надіслати ще →",
    missingKey: "Форма ще не налаштована. Напиши мені в Telegram або на пошту.", timeout: "Час очікування вичерпано. Перевір інтернет і спробуй знову.", error: "Не вдалося надіслати повідомлення. Спробуй ще раз або скористайся Telegram.",
    topics: [
      { value: "Website Design & Development", label: "Дизайн і розробка сайту" },
      { value: "UI/UX Design", label: "UI/UX дизайн" },
      { value: "Collaboration on Projects", label: "Співпраця над проєктом" },
      { value: "Website Projects Implementation", label: "Реалізація вебпроєкту" },
      { value: "Help with Personal Portfolio", label: "Допомога з портфоліо" },
      { value: "Something else", label: "Інше" },
    ],
  },
  misc: { top: "Повернутися вгору", themeLight: "Увімкнути світлу тему", themeDark: "Увімкнути темну тему", lightMode: "Світла тема", darkMode: "Темна тема", languageAria: "Мова сайту", rights: "Усі права захищено." },
}

export const dictionaries = { uk, en }
export type Locale = keyof typeof dictionaries
export type Dictionary = typeof en
export const DEFAULT_LOCALE: Locale = "en"
export const LOCALE_KEY = "raizkin-site-language"
