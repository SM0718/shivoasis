import { createFileRoute } from '@tanstack/react-router'

import { AboutPageAnimation } from '@/components/AboutPageAnimation/AboutPageAnimation'

export const Route = createFileRoute('/about')({
  component: AboutPageAnimation,
})
