import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import type { PageContent } from '@/lib/pages'

export function PageShell({ page }: { page: PageContent }) {
  return (
    <article className="bg-[#e8e8e3] px-[clamp(1.25rem,4vmin,2.5rem)] pt-[clamp(7rem,18vmin,12rem)] pb-[clamp(4rem,10vmin,8rem)] text-[#1a1a1a]">
      <div className="mx-auto max-w-[1400px]">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.22em] text-[#1a1a1a]/50 uppercase transition-colors hover:text-[#1a1a1a]"
        >
          <ArrowLeft className="size-3.5" aria-hidden />
          Index
        </Link>

        <p className="mt-[clamp(2.5rem,7vmin,4.5rem)] text-[11px] tracking-[0.28em] text-[#1a1a1a]/45 uppercase">
          {page.eyebrow}
        </p>

        <h1 className="mt-4 font-display text-[clamp(2.6rem,11vw,7rem)] leading-[0.92] font-extrabold tracking-[0.01em] uppercase">
          {page.title}
        </h1>

        <div className="mt-[clamp(2rem,5vmin,3.5rem)] grid grid-cols-1 gap-x-10 gap-y-8 lg:grid-cols-12">
          <p className="font-serif text-[clamp(1.2rem,2.6vw,1.8rem)] leading-[1.35] font-medium lg:col-span-6">
            {page.lede}
          </p>

          <div className="space-y-5 lg:col-span-5 lg:col-start-8">
            {page.body.map((para) => (
              <p key={para} className="text-[15px] leading-[1.75] font-light text-[#1a1a1a]/70">
                {para}
              </p>
            ))}
          </div>
        </div>

        <dl className="mt-[clamp(2.5rem,7vmin,4.5rem)] grid grid-cols-1 gap-y-6 border-t border-[#1a1a1a]/12 pt-8 sm:grid-cols-3">
          {page.meta.map((entry) => (
            <div key={entry.label}>
              <dt className="text-[11px] tracking-[0.2em] text-[#1a1a1a]/40 uppercase">
                {entry.label}
              </dt>
              <dd className="mt-2 font-serif text-[clamp(1.3rem,3vw,1.9rem)] leading-tight font-semibold">
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  )
}
