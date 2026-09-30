/*
 * Replaced by the Three.js paper menu in ./HamburgerMenu.
 * Kept here, commented out, so the old InfiniteMenu navigation can be restored.
 */

/*
import { useCallback, useMemo, useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft, X } from 'lucide-react'

import InfiniteMenu, { type MenuItem } from '@/components/InfiniteMenu'

export type MenuEntry = {
  id: string
  title: string
  description: string
  link: string
  image: string
  children?: MenuEntry[]
}

const MENU: MenuEntry[] = [
  {
    id: 'services',
    title: 'Services',
    description: 'Four disciplines',
    link: '/services',
    image: '/menu/services.jpg',
    children: [
      {
        id: 'architectural-design',
        title: 'Architectural Design',
        description: 'RIBA 0–7',
        link: '/services/architectural-design',
        image: '/menu/svc-architectural.jpg',
      },
      {
        id: 'interior-design',
        title: 'Interior Design',
        description: 'Material & acoustic',
        link: '/services/interior-design',
        image: '/menu/svc-interior.jpg',
      },
      {
        id: 'design-construction',
        title: 'Design & Construction',
        description: 'On site weekly',
        link: '/services/design-construction',
        image: '/menu/svc-construction.jpg',
      },
      {
        id: 'conservation-heritage',
        title: 'Conservation & Heritage',
        description: 'Grade I–II',
        link: '/services/conservation-heritage',
        image: '/menu/svc-heritage.jpg',
      },
    ],
  },
  {
    id: 'portfolio',
    title: 'Portfolio',
    description: 'Selected works',
    link: '/portfolio',
    image: '/menu/portfolio.jpg',
    children: [
      {
        id: 'planning-applications',
        title: 'Planning Applications',
        description: '38 submitted',
        link: '/portfolio/planning-applications',
        image: '/menu/pf-planning.jpg',
      },
      {
        id: 'portfolio-conservation',
        title: 'Conservation & Heritage',
        description: '7 listed entries',
        link: '/portfolio/conservation-heritage',
        image: '/menu/pf-heritage.jpg',
      },
    ],
  },
  {
    id: 'about',
    title: 'About',
    description: 'The studio',
    link: '/about',
    image: '/menu/about.jpg',
  },
  {
    id: 'contact',
    title: 'Contact',
    description: 'Start a project',
    link: '/contact',
    image: '/menu/contact.jpg',
  },
]

export function SiteMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter()
  const [branch, setBranch] = useState<MenuEntry | null>(null)

  const entries = useMemo(() => (branch ? (branch.children ?? []) : MENU), [branch])
  const items: MenuItem[] = useMemo(() => entries.map(toMenuItem), [entries])

  const handleSelect = useCallback(
    (item: MenuItem) => {
      const entry = entries.find((e) => e.id === item.id)
      if (!entry) return

      if (entry.children?.length) {
        setBranch(entry)
        return
      }

      onClose()
      void router.navigate({ to: entry.link })
    },
    [entries, onClose, router]
  )

  return (
    <div
      className={`fixed inset-0 z-50 transition-[opacity,visibility] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] ${
        open ? 'visible opacity-100' : 'invisible opacity-0'
      }`}
      aria-hidden={!open}
    >
      <div className="absolute inset-0 bg-[#1a1a1a]">
        {open ? (
          <InfiniteMenu
            key={branch?.id ?? 'root'}
            items={items}
            scale={1}
            backgroundColor="#1a1a1a"
            onSelect={handleSelect}
            activeIndex={0}
          />
        ) : null}
      </div>

      <div
        className={`pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-[clamp(1.25rem,4vmin,2.5rem)] py-[clamp(0.9rem,2.2vmin,1.4rem)] transition-all duration-500 ${
          open ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'
        }`}
      >
        <Link
          to="/"
          onClick={onClose}
          className="pointer-events-auto font-display text-[clamp(1.1rem,2.4vmin,1.5rem)] leading-none font-extrabold tracking-[0.06em] text-[#f6eee8] uppercase"
        >
          Shivoasis
        </Link>

        <div className="pointer-events-auto flex items-center gap-2">
          {branch ? (
            <button
              type="button"
              onClick={() => setBranch(null)}
              className="inline-flex items-center gap-2 rounded-full border border-[#f6eee8]/25 px-4 py-2 text-[11px] tracking-[0.18em] text-[#f6eee8]/80 uppercase transition hover:bg-[#f6eee8]/10"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              All sections
            </button>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-10 place-items-center rounded-full border border-[#f6eee8]/25 text-[#f6eee8] transition hover:bg-[#f6eee8]/10"
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}

function toMenuItem(entry: MenuEntry): MenuItem {
  return {
    id: entry.id,
    image: entry.image,
    link: entry.link,
    title: entry.title,
    description: entry.description,
  }
}
*/
