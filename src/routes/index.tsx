import { createFileRoute } from '@tanstack/react-router'

import { ArchitectureGallery } from '@/components/ArchitectureGallery'
import { architectureProjects } from '@/components/ArchitectureGallery/architectureProjects'

export const Route = createFileRoute('/')({
  component: HomePage,
})

/*
 * Previous hero, replaced by the scroll-driven ArchitectureGallery.
 * Uncomment to restore it.
 */

/*
import {
  ShivoasisArchitecturePoster,
  type ShivoasisPosterProps,
} from '@/components/ui/shivoasis-architecture-poster'

const POSTER = {
  title: 'SHIVOASIS',
  keywords: [
    { label: 'Structure' },
    { label: 'Form' },
    { label: 'Space' },
  ],
  headline: 'Concrete Meets Light',
  body: 'Where brutalism meets tranquility. Explore the intersection of structural integrity and modern aesthetics, designed to endure the elements while elevating the human experience.',
  subheadline: 'Built for eternity.',
  footerLeft: 'Shivoasis Studio',
  footerCenter: 'Vol. 01',
  footerRight: '10.29 2026',
  socialHandle: '@shivoasis.arch',
  sceneSrc:
    'https://images.unsplash.com/photo-1744126405308-b7fb2d430e96?q=80&w=2400&auto=format&fit=crop',
  sceneAlt:
    'Luxurious home interior with high ceilings, wood panelling and mid-century seating',
} satisfies ShivoasisPosterProps
*/

function HomePage() {
  return <ArchitectureGallery projects={architectureProjects} />
}
