import { createFileRoute } from '@tanstack/react-router'

import { ServicesCarouselPage } from '@/components/react-3d-carousel'

export const Route = createFileRoute('/services/architectural-design')({
  component: () => (
    <ServicesCarouselPage pageKey="services/architectural-design" />
  ),
})