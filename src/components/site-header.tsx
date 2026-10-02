import { Link } from '@tanstack/react-router'

import HamburgerMenu, {
  type HamburgerMenuItem,
} from '@/components/HamburgerMenu'
// import { SiteMenu } from '@/components/site-menu'

const MENU: HamburgerMenuItem[] = [
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Architectural design', href: '/services/architectural-design' },
      { label: 'Interior design', href: '/services/interior-design' },
      { label: 'Design & construction', href: '/services/design-construction' },
      { label: 'Conservation & heritage', href: '/services/conservation-heritage' },
    ],
  },
  {
    label: 'Portfolio',
    href: '/portfolio',
    children: [
      { label: 'Planning applications', href: '/portfolio/planning-applications' },
      { label: 'Conservation & heritage', href: '/portfolio/conservation-heritage' },
    ],
  },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export function SiteHeader({ tone = 'cream' }: { tone?: 'cream' | 'ink' }) {
  // The header sits over photographic heroes on most routes, but /portfolio is a
  // light editorial page, so it flips to ink to stay legible.
  const ink = tone === 'ink'

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="pointer-events-auto flex items-center justify-between px-[clamp(1.25rem,4vmin,2.5rem)] py-[clamp(0.9rem,2.2vmin,1.4rem)]">
          <Link
            to="/"
            className={`font-display text-[clamp(1.1rem,2.4vmin,1.5rem)] leading-none font-extrabold tracking-[0.06em] uppercase text-white`}
          >
            Shivoasis
          </Link>
        </div>
      </header>

      {/* Rendered outside <header> so the button's own z-index can sit above
          the fullscreen overlay (z-1900) and double as the close control. */}
      <div className="fixed top-[clamp(0.9rem,2.2vmin,1.4rem)] right-[clamp(1.25rem,4vmin,2.5rem)] z-[2000]">
        <HamburgerMenu
          items={MENU}
          logo="Shivoasis"
          tone={ink ? 'ink' : 'cream'}
        />
      </div>

      {/* <SiteMenu open={menuOpen} onClose={() => setMenuOpen(false)} /> */}
    </>
  )
}
