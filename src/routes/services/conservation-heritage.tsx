import { createFileRoute } from '@tanstack/react-router'

import { ServicesCarouselPage } from '@/components/react-3d-carousel'

export const Route = createFileRoute('/services/conservation-heritage')({
  component: () => (
    <ServicesCarouselPage pageKey="services/conservation-heritage" />
  ),
})