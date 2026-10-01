import { createRootRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ArrowUpRight } from 'lucide-react'

import { SiteHeader } from '@/components/site-header'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
})

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  /*
   * The header is fixed and transparent, so its tone has to match whatever
   * actually sits behind it. Dark routes are the home gallery, the portfolio
   * index, the contact page, and everything under /services, which renders
   * the dark #11110f react-3d-carousel. Every other route renders PageShell,
   * the light #e8e8e3 sheet — including the two light pages nested under
   * /portfolio, so /services is matched by prefix and /portfolio by exact
   * path.
   */
  const path = pathname.replace(/\/+$/, '') || '/'
  const onDark =
    path === '/' ||
    path === '/portfolio' ||
    path === '/contact' ||
    path === '/services' ||
    path.startsWith('/services/')

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-svh flex-col bg-[#e8e8e3] text-foreground">
        <SiteHeader tone={onDark ? 'cream' : 'ink'} />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </QueryClientProvider>
  )
}

function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#1a1a1a] px-6 text-[#f6eee8]">
      <p className="font-mono text-xs tracking-[0.3em] text-[#f6eee8]/50">
        404
      </p>
      <h1 className="font-serif text-4xl font-semibold sm:text-6xl">
        This volume is missing.
      </h1>
      <Link
        to="/"
        className="inline-flex items-center gap-2 border-b border-[#f6eee8]/30 pb-1 text-sm tracking-[0.16em] uppercase transition hover:border-[#f6eee8]"
      >
        Return to the poster
        <ArrowUpRight className="size-4" aria-hidden />
      </Link>
    </section>
  )
}
