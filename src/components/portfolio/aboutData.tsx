import type { ReactNode } from 'react'
import { Code2, PenTool, Rocket } from 'lucide-react'
import { profile } from '@/data/raizkin'
export const pillars = [
  { Icon: PenTool, title: 'Design', text: profile.process[0] },
  { Icon: Code2, title: 'Develop', text: profile.process[1] },
  { Icon: Rocket, title: 'Deliver', text: profile.process[2] },
]
export const strengths: string[] = [...profile.strengths]
export const stack = profile.stack.map(slug => ({
  slug, name: profile.techIcons.find(t => t.slug === slug)?.name ?? slug, invert: false,
}))
const K = ({children}:{children:ReactNode}) => <span className='text-[#34d399]'>{children}</span>
const V = ({children}:{children:ReactNode}) => <span className='text-[#5eead4]'>{children}</span>
const P = ({children}:{children:ReactNode}) => <span className='text-[#6b7280]'>{children}</span>
const S = ({children}:{children:ReactNode}) => <span className='text-[#f9a8d4]'>{children}</span>
const key = (str:string) => <span className='text-[#7dd3fc]'>{str}</span>
const quoted = (str:string) => <S>&quot;{str}&quot;</S>
const JOIN = (list:readonly string[]) => list.map((s,i)=><span key={s}>{i ? <P>, </P> : null}{quoted(s)}</span>)
export const LINES: ReactNode[] = [
  <><K>const</K> <V>{profile.firstName.toLowerCase()}</V> <P>= {'{'}</P></>,
  <>  {key('role')}<P>: </P>{quoted(profile.title)}<P>,</P></>,
  <>  {key('based')}<P>: </P>{quoted(profile.location)}<P>,</P></>,
  <>  {key('strengths')}<P>: [</P>{JOIN(profile.codeStrengths)}<P>],</P></>,
  <>  {key('stack')}<P>: [</P>{JOIN(profile.codeStack)}<P>],</P></>,
  <>  {key('motto')}<P>: </P>{quoted(profile.motto)}<P>,</P></>,
  <><P>{'}'}</P></>,
]
