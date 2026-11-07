import { Portfolio } from "@/components/portfolio/Portfolio"
import { LocaleProvider } from "@/i18n/LocaleProvider"

export default function Home() {
  return <LocaleProvider><Portfolio /></LocaleProvider>
}
