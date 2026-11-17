/**
 * RAIZKIN.DEV performance patch, 2026-11-17.
 * Run from the RAIZKIN-DEV project root: node optimize-raizkin.mjs
 * Creates a temporary backup outside the repository; never commits/pushes anything.
 * Targets the project structure reviewed from Raizkin/RAIZKIN-DEV (main).
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const root = process.cwd();
const content = new Map();
const files = [
  'src/data/raizkin.ts',
  'src/data/portfolio.ts',
  'src/components/portfolio/Projects.tsx',
  'src/components/portfolio/Background.tsx',
  'src/components/portfolio/Portfolio.tsx',
  'src/components/portfolio/Skills.tsx',
  'src/components/portfolio/Nav.tsx',
  'src/app/globals.css',
];

function must(condition, message) {
  if (!condition) throw new Error(message);
}
function replaceOnce(text, search, replacement, file) {
  const count = text.split(search).length - 1;
  must(count === 1, `${file}: expected one match, found ${count}. Your local code differs; nothing was changed.`);
  return text.replace(search, replacement);
}
function replaceRange(text, begin, finish, replacement, file) {
  const from = text.indexOf(begin);
  const to = text.indexOf(finish, from + begin.length);
  must(from >= 0 && to > from, `${file}: target section not found. Your local code differs; nothing was changed.`);
  return text.slice(0, from) + replacement + text.slice(to);
}
function updateProject(data, name, fit, background) {
  const titlePos = data.indexOf(`"title": "${name}"`);
  must(titlePos >= 0, `src/data/raizkin.ts: missing project ${name}`);
  const tagsPos = data.indexOf('"tags":', titlePos);
  must(tagsPos > titlePos && tagsPos - titlePos < 2000, `Cannot find ${name} tags`);
  const pre = data.slice(0, titlePos);
  let section = data.slice(titlePos, tagsPos);
  // Add design metadata next to the image: no title-specific styling logic in JSX.
  if (!/"imageFit"\s*:/.test(section)) {
    const match = section.match(/(^[ \t]*)"image":\s*"([^"]*)",/m);
    must(match, `No image property found for ${name}`);
    section = section.replace(match[0], `${match[1]}"image": "${match[2]}",\n${match[1]}"imageFit": "${fit}",\n${match[1]}"imageBackground": "${background}",`);
  }
  return pre + section + data.slice(tagsPos);
}

try {
  for (const file of files) {
    const absolute = path.join(root, file);
    must(fs.existsSync(absolute), `File not found: ${file}. Run this script in RAIZKIN-DEV root.`);
    content.set(file, fs.readFileSync(absolute, 'utf8'));
  }

  // 1) KnoxBot: no Visit button, no image click, no title navigation, no fake demo route.
  {
    const file = 'src/data/raizkin.ts';
    let data = content.get(file);
    const p = data.indexOf('"title": "KnoxBot"');
    must(p !== -1, 'KnoxBot is not in src/data/raizkin.ts');
    const next = data.indexOf('"tags":', p);
    const end = data.indexOf('"github":', next);
    must(next > p && end > next && end - p < 1600, 'Cannot identify KnoxBot project block');
    const before = data.slice(0, p);
    let block = data.slice(p, end);
    must(/"link":\s*"[^"]*"/.test(block), 'KnoxBot has no link field');
    block = block.replace(/"link":\s*"[^"]*"/, '"link": ""');
    data = before + block + data.slice(end);
    data = updateProject(data, 'Bohonos English School', 'cover', '#f9f1e9');
    data = updateProject(data, 'Euro Koshyk', 'contain', '#ff0000');
    data = updateProject(data, 'Weather Dashboard', 'cover', 'transparent');
    data = updateProject(data, 'KnoxBot', 'cover', 'transparent');
    content.set(file, data);
  }

  // 2) Design details in data, not comparisons against project names in React.
  {
    const file = 'src/data/portfolio.ts';
    let data = content.get(file);
    if (!data.includes('imageFit?:')) {
      const m = data.match(/export type Project = \{[^\n]+\}/);
      must(m, `${file}: Project type not found`);
      data = data.replace(m[0], 'export type Project = { title: string; description: string; image?: string; tags: string[]; link?: string; github?: string; imageFit?: "cover" | "contain"; imageBackground?: string; comingSoon?: boolean }');
    }
    if (!data.includes('imageFit: p.imageFit')) {
      data = replaceOnce(data, '  link: p.link || undefined, github: p.github || undefined,',
        '  link: p.link || undefined, github: p.github || undefined,\n  imageFit: p.imageFit, imageBackground: p.imageBackground,', file);
    }
    content.set(file, data);
  }

  // 3) Projects: one ScrollTrigger on desktop, native scrolling on tablets/phones.
  {
    const file = 'src/components/portfolio/Projects.tsx';
    let data = content.get(file);
    const importStart = 'import {\n  gsap,\n  useGSAP,\n  ScrollTrigger,\n  MOTION_OK,\n} from "@/lib/gsap"';
    if (data.includes(importStart)) data = replaceOnce(data, importStart, 'import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap"', file);
    const main = `  useGSAP(
    () => {
      const section = root.current
      const track = section?.querySelector<HTMLElement>(".projects-track")
      const counter = section?.querySelector<HTMLElement>(".projects-counter")
      const progressBar = section?.querySelector<HTMLElement>(".projects-progress")
      const pin = section?.querySelector<HTMLElement>(".projects-pin")
      if (!section || !track || !pin) return

      // Only one scroll-linked animation, and only on desktop.
      // Mobile/tablet cards scroll naturally (no pin stacks or pointer tilt).
      const mm = gsap.matchMedia()
      mm.add(\`(min-width: 1024px) and \${MOTION_OK}\`, () => {
        const distance = () => {
          const cards = track.querySelectorAll<HTMLElement>(".project-card")
          const last = cards[cards.length - 1]
          if (!last) return 0
          const left = track.getBoundingClientRect().left - Number(gsap.getProperty(track, "x"))
          return Math.max(0, left + last.offsetLeft + last.offsetWidth / 2 - window.innerWidth / 2)
        }

        const move = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            start: "center center",
            end: () => \`+=\${Math.max(distance(), 1)}\`,
            pin: true,
            scrub: 0.65,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              const current = pad(Math.min(projects.length, Math.floor(self.progress * projects.length) + 1))
              if (counter && counter.textContent !== current) counter.textContent = current
              if (progressBar) progressBar.style.transform = \`scaleX(\${self.progress})\`
            },
          },
        })
        return () => {
          move.kill()
          gsap.set(track, { clearProps: "transform" })
        }
      })
      return () => mm.revert()
    },
    { scope: root }
  )
`;
    data = replaceRange(data, '  useGSAP(\n', '\n  return (\n    <section', main, file);
    // Replace per-project hardcoded styling in card image.
    const imageBegin = '<div\n  className={`project-img absolute inset-y-0 ${';
    const imageEnd = '\n\n\n\n              <div className="absolute inset-0 bg-gradient';
    const imageCode = `<div
  className="project-img absolute inset-0"
  style={{ backgroundColor: project.imageBackground }}
>
  <Image
    src={asset(project.image)}
    alt={project.title}
    fill
    sizes="(min-width: 1280px) 520px, (min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw"
    className={\`\${project.imageFit === "contain" ? "object-contain p-2" : "object-cover"} object-center transition-transform duration-500 group-hover:scale-[1.03]\`}
  />
</div>`;
    if (data.includes(imageBegin)) data = replaceRange(data, imageBegin, imageEnd, imageCode, file);
    else must(data.includes('style={{ backgroundColor: project.imageBackground }}'), `${file}: image block not found`);
    content.set(file, data);
  }

  // 4) Background: 10 lightweight compositor-friendly CSS animations, no GSAP and no pointer listener.
  {
    const file = 'src/components/portfolio/Background.tsx';
    content.set(file, `"use client"

import { deviconUrl, techIcons } from "@/data/portfolio"

const INVERT = new Set(["nextjs", "express", "vercel"])
const FLOATERS = techIcons.slice(0, 10)

export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0">
        <div className="absolute left-[-15%] top-[-10%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgb(13_148_136/0.19),transparent_65%)]" />
        <div className="absolute right-[-20%] top-[30%] h-[55vmax] w-[55vmax] rounded-full bg-[radial-gradient(circle,rgb(5_150_105/0.16),transparent_65%)]" />
      </div>
      <div className="bg-grid absolute inset-0 opacity-[0.07]" />
      {FLOATERS.map(({ slug, name }, index) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={slug}
          src={deviconUrl(slug)}
          alt=""
          title={name}
          width={36}
          height={36}
          loading="lazy"
          className={\`raizkin-bg-floater absolute top-0 opacity-20 \${INVERT.has(slug) ? "dark:invert" : ""}\`}
          style={{
            left: \`\${(index * 29 + 9) % 91}%\`,
            animationDelay: \`-\${index * 3.2}s\`,
            animationDuration: \`\${23 + (index % 4) * 6}s\`,
          }}
        />
      ))}
    </div>
  )
}
`);
  }

  // 5) Native scrolling. No ScrollSmoother startup/forced scrollTop/touch lag.
  {
    const file = 'src/components/portfolio/Portfolio.tsx';
    content.set(file, `"use client"

import { useState } from "react"
import { useI18n } from "@/i18n/LocaleProvider"
import { Preloader } from "./Preloader"
import { Cursor } from "./Cursor"
import { Background } from "./Background"
import { Nav } from "./Nav"
import { Hero } from "./Hero"
import { About } from "./About"
import { Projects } from "./Projects"
import { Skills } from "./Skills"
import { BackToTop, Contact, Footer } from "./Contact"

export function Portfolio() {
  const [ready, setReady] = useState(false)
  const { locale } = useI18n()

  return (
    <>
      <Preloader onReveal={() => setReady(true)} />
      <Cursor />
      <Background />
      <Nav key={\`nav-\${locale}\`} ready={ready} />
      <BackToTop />
      <div id="smooth-wrapper" className="relative z-10">
        <div id="smooth-content">
          <main>
            <Hero key={\`hero-\${locale}\`} ready={ready} />
            <About key={\`about-\${locale}\`} />
            <Projects key={\`projects-\${locale}\`} />
            <Skills key={\`skills-\${locale}\`} />
            <Contact key={\`contact-\${locale}\`} />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
`);
  }

  // 6) Skills: stop perpetual orbit animations off-screen, remove velocity-triggered tween storm.
  {
    const file = 'src/components/portfolio/Skills.tsx';
    let data = content.get(file);
    const from = '        // Scrolling fast makes the galaxy spin faster, then it settles.';
    const to = '        // Cycle through groups while on screen, until the visitor picks one.';
    const replacement = `        // Pause the GPU-heavy orbit loops whenever Skills is off-screen.
        loops.forEach((loop) => loop.pause())
        ScrollTrigger.create({
          trigger: ".galaxy",
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            loops.forEach((loop) => {
              if (self.isActive) loop.resume()
              else loop.pause()
            })
          },
        })

`;
    if (data.includes(from)) data = replaceRange(data, from, to, replacement, file);
    else must(data.includes('Pause the GPU-heavy orbit loops'), `${file}: expected skills animation not found`);
    // Remove clearly unused imports/destructuring (no functional changes).
    data = data.replace('import { profile } from "@/data/raizkin"\n', '');
    data = data.replace('const { t, locale } = useI18n()', 'const { t } = useI18n()');
    content.set(file, data);
  }

  // 7) Native scrolling requires locking the document behind the mobile nav menu.
  {
    const file = 'src/components/portfolio/Nav.tsx';
    let data = content.get(file);
    if (data.includes('ScrollSmoother.get()?.paused(open)')) {
      data = replaceOnce(data, '    ScrollSmoother.get()?.paused(open)',
        '    document.body.style.overflow = open ? "hidden" : ""', file);
      data = data.replace('ScrollTrigger, ScrollSmoother, scrollToTarget',
        'ScrollTrigger, scrollToTarget');
      data = replaceOnce(data, '  const toggleMenu = (open: boolean) => {',
        '  useEffect(() => () => { document.body.style.overflow = "" }, [])\n\n  const toggleMenu = (open: boolean) => {', file);
    } else must(data.includes('document.body.style.overflow = open ?'),
      `${file}: mobile nav handler not recognized`);
    content.set(file, data);
  }

  // 8) GPU-friendly CSS motion, no JS requestAnimationFrame loops on the backdrop.
  {
    const file = 'src/app/globals.css';
    let data = content.get(file);
    if (!data.includes('@keyframes raizkinFloat')) data += `
/* Lightweight tech icon drift: replaces dozens of infinite GSAP tweens. */
@keyframes raizkinFloat {
  0%   { transform: translate3d(0, 110vh, 0) rotate(-12deg); opacity: 0; }
  10%  { opacity: .20; }
  88%  { opacity: .20; }
  100% { transform: translate3d(0, -100px, 0) rotate(12deg); opacity: 0; }
}
.raizkin-bg-floater {
  animation-name: raizkinFloat;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}
@media (prefers-reduced-motion: reduce) {
  .raizkin-bg-floater { animation: none; opacity: 0; }
}
`;
    content.set(file, data);
  }

  // Preflight validated everything, now atomically write changes, with a backup outside Git.
  const backupDir = fs.mkdtempSync(path.join(os.tmpdir(), 'raizkin-performance-backup-'));
  for (const file of files) {
    const old = fs.readFileSync(path.join(root, file), 'utf8');
    const next = content.get(file);
    if (old === next) continue;
    const backupPath = path.join(backupDir, file);
    fs.mkdirSync(path.dirname(backupPath), { recursive: true });
    fs.writeFileSync(backupPath, old, 'utf8');
    fs.writeFileSync(path.join(root, file), next, 'utf8');
    console.log(`Updated: ${file}`);
  }
  console.log(`\nDone. Backups: ${backupDir}`);
  console.log('Next: npm run build');
  console.log('No Git commits or pushes were made.');
} catch (error) {
  console.error(`\nPatch stopped: ${error.message}`);
  process.exitCode = 1;
}
