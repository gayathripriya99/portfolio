import { createContext, useContext } from 'react'
import type { SectionId } from '../data/profile'
import type { SkillCategory } from '../data/skills'

/** Actions shared by the nav, command palette, terminal and recruiter brief. */
export interface OS {
  goTo: (id: SectionId) => void
  openProject: (slug: string) => void
  randomProject: () => void
  openResume: (download?: boolean) => void
  openPalette: () => void
  toggleTerminal: (open?: boolean) => void
  toggleTheme: () => void
  toggleMotion: () => void
  toggleRecruiter: () => void
  focusCategory: (c: SkillCategory) => void
  copyEmail: () => void
  easterEgg: () => void
}

export const OSContext = createContext<OS | null>(null)

export function useOS() {
  const os = useContext(OSContext)
  if (!os) throw new Error('useOS must be used inside <OSContext.Provider>')
  return os
}
