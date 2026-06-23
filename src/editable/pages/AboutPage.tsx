import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f6f0e5] text-[#111]">
        <section className="border-b border-black bg-[#f5efe3]">
          <div className="mx-auto max-w-[980px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#f63a2a]">{pagesContent.about.badge}</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
              <div>
                <h1 className="editorial-serif max-w-3xl text-5xl leading-[1.02] tracking-[-0.045em] text-[#111] sm:text-6xl">
                  {pagesContent.about.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">{pagesContent.about.description}</p>
              </div>
              <div className="rounded-[1.5rem] border border-black bg-white p-6 shadow-[4px_4px_0_#111]">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Overview</p>
                <p className="mt-4 text-base leading-8 text-black/72">
                  {SITE_CONFIG.name} brings strategy content, release guidance, and connected discovery into one tighter editorial experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[980px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <article className="rounded-[1.7rem] border border-black bg-white p-6 shadow-[5px_5px_0_#111] sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">About {SITE_CONFIG.name}</p>
              <div className="article-content mt-6">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/search" className="inline-flex items-center rounded-xl border border-black bg-[#f63a2a] px-5 py-3 text-sm font-semibold text-white shadow-[3px_3px_0_#111]">
                  Explore the archive
                </Link>
                <Link href="/contact" className="inline-flex items-center rounded-xl border border-black/15 bg-[#f5efe3] px-5 py-3 text-sm font-semibold text-[#111]">
                  Contact us
                </Link>
              </div>
            </article>

            <aside className="space-y-5">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className="rounded-[1.4rem] border border-black/15 bg-white p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f63a2a]">0{index + 1}</p>
                  <h2 className="editorial-serif mt-3 text-3xl leading-tight tracking-[-0.03em] text-[#111]">{value.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-black/65">{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section className="border-t border-black bg-[#1f1f1f] text-white">
          <div className="mx-auto max-w-[980px] px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
            <div className="rounded-[1.7rem] border border-white/10 bg-white/5 px-6 py-8 sm:px-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f7c96c]">Keep reading</p>
                  <h2 className="editorial-serif mt-3 max-w-2xl text-4xl leading-none tracking-[-0.04em] sm:text-5xl">
                    Read the stories shaping the conversation.
                  </h2>
                </div>
                <Link href="/search" className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#f63a2a] px-5 py-3 text-sm font-semibold text-white">
                  Explore the archive <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
