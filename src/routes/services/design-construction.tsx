import { createFileRoute } from '@tanstack/react-router'

import { ServicesCarouselPage } from '@/components/react-3d-carousel'

export const Route = createFileRoute('/services/design-construction')({
  component: () => (
    <ServicesCarouselPage pageKey="services/design-construction" />
  ),
})