
"use client"

import { useRef } from "react"
import Image from "next/image"
import { ArrowUpRight, Github } from "lucide-react"
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  MOTION_OK,
} from "@/lib/gsap"
import {
  projects as baseProjects,
  type Project,
} from "@/data/portfolio"
import { useI18n } from "@/i18n/LocaleProvider"
import { asset } from "@/lib/utils"
import { SectionHeading } from "./SectionHeading"

const pad = (n: number) => String(n).padStart(2, "0")

export function Projects() {
  const { t } = useI18n()
  const root = useRef<HTMLElement>(null)

  const projects = baseProjects.map((project) => ({
    ...project,
    description:
      t.projects.descriptions[project.title] ??
      project.description,
  }))

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const track =
        root.current!.querySelector<HTMLElement>(
          ".projects-track"
        )!
      const counter =
        root.current!.querySelector<HTMLElement>(
          ".projects-counter"
        )!

      // Desktop: horizontal scrolling.
      mm.add(
        `(min-width: 1024px) and ${MOTION_OK}`,
        () => {
          gsap.set(".projects-viewport", {
            overflow: "visible",
          })

          const distance = () => {
            const cards =
              track.querySelectorAll<HTMLElement>(
                ".project-card"
              )

            const lastCard = cards[cards.length - 1]

            if (!lastCard) return 0

            const cardCenter =
              lastCard.offsetLeft +
              lastCard.offsetWidth / 2

            const trackLeft =
              track.getBoundingClientRect().left -
              Number(gsap.getProperty(track, "x"))

            return Math.max(
              0,
              trackLeft +
              cardCenter -
              window.innerWidth / 2
            )
          }

          const horizontal = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: ".projects-pin",
              start: "center center",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              anticipatePin: 1,

              onUpdate: (self) => {
                const index = Math.min(
                  projects.length,
                  Math.floor(
                    self.progress * projects.length
                  ) + 1
                )

                counter.textContent = pad(index)
              },
            },
          })

          gsap.to(".projects-progress", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".projects-pin",
              start: "center center",
              end: () => `+=${distance()}`,
              scrub: true,
            },
          })

          gsap.utils
            .toArray<HTMLElement>(".project-card")
            .forEach((card) => {
              const image =
                card.querySelector(".project-img")

              if (image) {
                gsap.fromTo(
                  image,
                  { xPercent: -8 },
                  {
                    xPercent: 8,
                    ease: "none",
                    scrollTrigger: {
                      trigger: card,
                      containerAnimation: horizontal,
                      start: "left right",
                      end: "right left",
                      scrub: true,
                    },
                  }
                )
              }

              gsap.from(card, {
                rotateY: -25,
                autoAlpha: 0.2,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: horizontal,
                  start: "left 110%",
                  end: "left 70%",
                  scrub: true,
                },
              })
            })
        }
      )

      // Mobile and tablet: stacking cards.
      mm.add(
        `(max-width: 1023px) and ${MOTION_OK}`,
        () => {
          const cards =
            gsap.utils.toArray<HTMLElement>(
              ".project-card"
            )

          if (!cards.length) return

          const last = cards.length - 1

          const head =
            root.current!.querySelector<HTMLElement>(
              ".projects-head"
            )!

          const headTop = () =>
            (document.querySelector<HTMLElement>(
              ".site-nav"
            )?.offsetHeight ?? 64) + 8

          const titleBottom = () => {
            const h2 = head.querySelector("h2")!

            return (
              h2.getBoundingClientRect().bottom -
              head.getBoundingClientRect().top
            )
          }

          const top = (i: number) =>
            headTop() + titleBottom() + 24 + i * 12

          ScrollTrigger.create({
            trigger: head,
            start: () => `top top+=${headTop()}`,
            endTrigger: cards[last],
            end: () => `top top+=${top(last)}`,
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          })

          cards.forEach((card, i) => {
            ScrollTrigger.create({
              trigger: card,
              start: () => `top top+=${top(i)}`,
              endTrigger: cards[last],
              end: () => `top top+=${top(last)}`,
              pin: true,
              pinSpacing: false,
              invalidateOnRefresh: true,
            })

            if (i === last) return

            gsap
              .timeline({
                scrollTrigger: {
                  trigger: cards[i + 1],
                  start: "top bottom",
                  end: () =>
                    `top top+=${top(i + 1)}`,
                  scrub: true,
                  invalidateOnRefresh: true,
                },
              })
              .to(
                card.querySelector(".project-inner"),
                {
                  scale: 0.9,
                  rotateX: 10,
                  ease: "none",
                },
                0
              )
              .to(
                card.querySelector(".stack-shade"),
                {
                  opacity: 0.55,
                  ease: "none",
                },
                0
              )
          })

          gsap.from(cards[0], {
            y: 60,
            autoAlpha: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: cards[0],
              start: "top 90%",
            },
          })
        }
      )

      // Mouse-based 3D tilt effect.
      mm.add(
        `(pointer: fine) and ${MOTION_OK}`,
        () => {
          const cleanups = gsap.utils
            .toArray<HTMLElement>(".project-card")
            .map((card) => {
              const inner =
                card.querySelector<HTMLElement>(
                  ".project-inner"
                )!

              const rx = gsap.quickTo(
                inner,
                "rotationX",
                {
                  duration: 0.6,
                  ease: "power3",
                }
              )

              const ry = gsap.quickTo(
                inner,
                "rotationY",
                {
                  duration: 0.6,
                  ease: "power3",
                }
              )

              const move = (e: PointerEvent) => {
                const rect =
                  card.getBoundingClientRect()

                ry(
                  ((e.clientX - rect.left) /
                    rect.width -
                    0.5) *
                  12
                )

                rx(
                  -(
                    (e.clientY - rect.top) /
                    rect.height -
                    0.5
                  ) * 12
                )
              }

              const leave = () => {
                rx(0)
                ry(0)
              }

              card.addEventListener(
                "pointermove",
                move
              )

              card.addEventListener(
                "pointerleave",
                leave
              )

              return () => {
                card.removeEventListener(
                  "pointermove",
                  move
                )

                card.removeEventListener(
                  "pointerleave",
                  leave
                )
              }
            })

          return () =>
            cleanups.forEach((cleanup) =>
              cleanup()
            )
        }
      )
    },
    { scope: root }
  )

  return (
    <section
      ref={root}
      id="projects"
      className="relative px-6 py-10 md:py-14 lg:overflow-x-clip"
    >
      <div className="projects-head mx-auto w-full max-w-7xl">
        <SectionHeading
          eyebrow={t.projects.eyebrow}
          lead={t.projects.lead}
          accent={t.projects.accent}
          lag={false}
        >
          {t.projects.intro}
        </SectionHeading>
      </div>

      <div className="projects-pin lg:flex lg:flex-col">
        <div className="projects-viewport lg:-mx-6 lg:overflow-x-auto lg:px-12">
          <div className="projects-track mx-auto flex max-w-xl flex-col gap-6 [perspective:1400px] lg:mx-0 lg:w-max lg:max-w-none lg:flex-row lg:gap-10">
            {projects.map((project, i) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={i}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 hidden w-full max-w-7xl items-center gap-6 px-6 font-mono text-sm text-gray-400 lg:flex">
          <span>
            <span className="projects-counter text-white">
              01
            </span>{" "}
            / {pad(projects.length)}
          </span>

          <div className="h-px flex-1 bg-white/10">
            <div className="projects-progress h-full origin-left scale-x-0 bg-gradient-to-r from-blue-400 to-purple-400" />
          </div>

          <span>{t.projects.scroll}</span>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({
  project,
  index,
}: {
  project: Project
  index: number
}) {
  // Each component accesses the translations independently.
  const { t } = useI18n()

  return (
    <article
      className="project-card group lg:w-[400px] lg:shrink-0 xl:w-[440px]"
      data-cursor={
        project.link
          ? t.projects.view
          : undefined
      }
    >
      <div className="project-inner relative flex h-full origin-top flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl shadow-black/40 transition-colors duration-300 [transform-style:preserve-3d] group-hover:border-blue-500/50 lg:bg-neutral-900/90 lg:shadow-none">
        <span
          className="stack-shade pointer-events-none absolute inset-0 z-20 bg-[#000] opacity-0 lg:hidden"
          aria-hidden="true"
        />

        <div className="relative h-52 overflow-hidden">
          {project.image ? (
            <>

              

<div
  className={`project-img absolute inset-y-0 ${
    project.title === "Euro Koshyk"
      ? "inset-x-0 bg-[#ff0000]"
      : project.title === "Bohonos English School"
        ? "inset-x-0 bg-[#f9f1e9]"
        : "-inset-x-[10%]"
  }`}
>
  <Image
    src={asset(project.image)}
    alt={project.title}
    fill
    sizes="(min-width: 1280px) 520px, (min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw"
    className={
      project.title === "Bohonos English School"
        ? "object-cover object-center transition-transform duration-700 group-hover:scale-105"
        : project.title === "Euro Koshyk"
          ? "object-contain p-2 transition-transform duration-700 group-hover:scale-105"
          : "object-cover transition-transform duration-700 group-hover:scale-110"
    }
  />
</div>




              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(0_0_0/0.7)] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {project.link && (
                <a
                  href={project.link}
                  aria-label={`Open ${project.title}`}
                  className="absolute inset-0 z-[5]"
                />
              )}

              <div className="absolute right-3 top-3 z-10 flex gap-2.5">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-white/70 bg-black/85 px-4 text-sm font-bold text-white shadow-xl shadow-black/60 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                    aria-label={`${project.title} ${t.projects.github}`}
                  >
                    <Github className="h-5 w-5" />
                    GitHub
                  </a>
                )}

                {project.link && (
                  <a
                    href={project.link}
                    className="group/live inline-flex min-h-11 items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 pl-4 pr-3 text-sm font-extrabold text-black shadow-xl shadow-black/60 ring-2 ring-white/80 transition duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
                    aria-label={`${t.projects.visit} ${project.title}`}
                  >
                    {t.projects.visit}

                    <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover/live:translate-x-0.5 group-hover/live:-translate-y-0.5" />
                  </a>
                )}
              </div>
            </>
          ) : (
            <div className="h-full animate-pulse bg-gradient-to-br from-neutral-800 to-neutral-900" />
          )}

          <span className="absolute bottom-3 left-4 font-mono text-5xl font-black text-white/15">
            {pad(index + 1)}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="mb-2 text-xl font-bold">
            {project.link ? (
              <a
                href={project.link}
                className="hover:text-blue-300"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}  
          </h3>

          <p className="mb-5 line-clamp-3 flex-1 text-gray-400">
            {project.description}
          </p>

          <ul className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
