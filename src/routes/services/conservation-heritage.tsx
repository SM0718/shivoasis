import { createFileRoute } from '@tanstack/react-router'

import { PageShell } from '@/components/page-shell'
import { getPage } from '@/lib/pages'

export const Route = createFileRoute('/services/conservation-heritage')({
  component: () => <PageShell page={getPage('services/conservation-heritage')} />,
})
