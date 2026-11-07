import { profile } from './raizkin'
import { asset } from '@/lib/utils'

export const EMAIL: string = profile.contact.email || ''
export const CV_PATH = ''
export const socials = {
  github: profile.contact.github,
  telegram: profile.contact.telegram,
  linkedin: profile.contact.linkedin || '',
  discord: profile.contact.discord || '',
  email: EMAIL ? `mailto:${EMAIL}` : '',
}
export const navItems = ['About', 'Projects', 'Skills', 'Contact'] as const
export const roles: string[] = [...profile.roles]
export type Project = { title: string; description: string; image?: string; tags: string[]; link?: string; github?: string; comingSoon?: boolean }
export const projects: Project[] = profile.projects.map(p => ({
  title: p.title, description: p.description, image: p.image, tags: [...p.tags],
  link: p.link || undefined, github: p.github || undefined,
}))
export const skillClusters = profile.skills.map(s => ({title:s.title, accent:s.accent, items:[...s.items]}))
export const techIcons: { slug:string; name:string; variant?:string }[] = profile.techIcons.map(t => ({slug:t.slug, name:t.name}))
/** Local SVGs: unlike a CDN URL, these work when jsDelivr or Devicon is blocked. */
export const deviconUrl = (slug:string, _variant = 'original') => asset(`/tech-icons/${slug}.svg`)
