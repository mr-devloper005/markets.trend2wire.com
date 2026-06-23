import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { CompactIndexCard, getEditableExcerpt, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function getEditableCategoryFallback(post: SitePost, fallback: string) {
  const content = post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post.tags?.[0] || fallback
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const side = posts.slice(1, 4)
  const trending = posts.slice(4, 8)
  const heroTitle = pagesContent.home.hero.title.join(' ')

  return (
    <section className="border-b border-black bg-[#f5efe3]">
      <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        {!lead ? (
          <div className="rounded-[2rem] border border-black bg-white p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f63a2a]">{pagesContent.home.hero.badge}</p>
            <h1 className="editorial-serif mt-5 max-w-4xl text-5xl leading-[0.95] tracking-[-0.05em] text-[#111] sm:text-6xl">{heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-black/68">{pagesContent.home.hero.description}</p>
          </div>
        ) : (
          <div className="rounded-[2rem] border border-black bg-white p-8 shadow-[5px_5px_0_#111] sm:p-10">
            <p className="text-xs font-medium text-black/65">
              Updated guidance · {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <h1 className="editorial-serif mt-5 max-w-3xl text-5xl leading-[1.02] tracking-[-0.05em] text-[#111] sm:text-6xl">
              {lead.title || heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-black/72">
              {getEditableExcerpt(lead, 240) || pagesContent.home.hero.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href={postHref(primaryTask, lead, primaryRoute)} className="rounded-xl border-2 border-black bg-[#f63a2a] px-6 py-3 text-sm font-semibold text-white shadow-[3px_3px_0_#111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none">
                Read full guide
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-[#f7f2e8] p-4 ring-1 ring-black/10 sm:max-w-xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-black/15 bg-[#efe7d6] text-sm font-semibold text-[#111]">
                MD
              </div>
              <div>
                <p className="text-base font-semibold text-[#111]">Editorially organized for media teams and communication leads.</p>
                <p className="mt-1 text-sm text-black/55">Clearer comparisons, stronger reading flow, and faster discovery.</p>
              </div>
            </div>
          </div>
        )}

        {!!side.length && (
          <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
            <Link href={postHref(primaryTask, side[0] || lead, primaryRoute)} className="group block rounded-[1.8rem] border border-black bg-white p-6 shadow-[4px_4px_0_#111] sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f63a2a]">Featured briefing</p>
              <h2 className="editorial-serif mt-4 text-4xl leading-[1.04] tracking-[-0.04em] text-[#111] sm:text-5xl">{(side[0] || lead).title}</h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-black/68">{getEditableExcerpt(side[0] || lead, 220)}</p>
            </Link>
            <div className="rounded-[1.7rem] border border-black bg-white p-6">
              <div className="flex items-end justify-between border-b border-black pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Table of contents</p>
                  <h2 className="mt-2 text-2xl font-semibold text-[#111]">What readers are opening</h2>
                </div>
              </div>
              <div className="mt-3">
                {trending.map((post, index) => (
                  <CompactIndexCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(5, 11).length ? posts.slice(5, 11) : posts.slice(0, 6)
  if (!railPosts.length) return null

  return (
    <section className="border-b border-black/10 bg-white">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f63a2a]">Latest articles</p>
            <h2 className="editorial-serif mt-3 text-5xl leading-none tracking-[-0.04em] text-[#111]">Fresh perspectives</h2>
          </div>
          <Link href={primaryRoute} className="hidden text-sm font-semibold text-black/70 hover:text-[#f63a2a] sm:inline-flex">
            View all <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {railPosts.map((post, index) => (
            <Link key={post.id || post.slug || index} href={postHref(primaryTask, post, primaryRoute)} className="group block rounded-[1.7rem] border border-black/15 bg-[#faf7f0] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,.12)]">
              <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f63a2a]">
                <span>{getEditableCategoryFallback(post, taskLabel(primaryTask))}</span>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="editorial-serif mt-4 text-3xl leading-tight tracking-[-0.03em] text-[#111]">{post.title}</h3>
              <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/63">{getEditableExcerpt(post, 160)}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const feature = posts[11] || posts[0]
  const side = posts.slice(12, 16).length ? posts.slice(12, 16) : posts.slice(1, 5)
  if (!feature) return null

  return (
    <section className="border-b border-black bg-[#f5efe3]">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <Link href={postHref(primaryTask, feature, primaryRoute)} className="group rounded-[1.8rem] border border-black bg-white p-6 shadow-[5px_5px_0_#111] sm:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f63a2a]">Editorial feature</p>
            <h3 className="editorial-serif mt-4 text-4xl leading-[1.04] tracking-[-0.04em] text-[#111] sm:text-5xl">{feature.title}</h3>
            <p className="mt-5 max-w-2xl text-base leading-8 text-black/68">{getEditableExcerpt(feature, 230)}</p>
          </Link>

          <div className="grid gap-5">
            {side.map((post, index) => (
              <Link key={post.id || post.slug || index} href={postHref(primaryTask, post, primaryRoute)} className="group rounded-[1.5rem] border border-black/15 bg-white p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f63a2a]">{index % 2 === 0 ? 'Compact brief' : 'Editorial note'}</p>
                <h3 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#111]">{post.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-black/62">{getEditableExcerpt(post, 130)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = collected.length ? collected : posts.slice(3)
  const lead = source[0] || posts[0]
  const briefs = source.slice(1, 7)
  if (!lead) return null

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)_220px]">
          <aside className="rounded-[1.7rem] border border-black/15 bg-[#f5efe3] p-6 lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#111]">Table of contents</p>
            <div className="mt-5 grid gap-4 text-sm leading-6 text-black/68">
              <p>What media distribution means today</p>
              <p>Choosing channels that fit the moment</p>
              <p>Formats that support stronger visibility</p>
              <p>What to review before publishing</p>
              <p>Examples, resources, and next reads</p>
            </div>
          </aside>

          <div>
            <Link href={postHref(primaryTask, lead, primaryRoute)} className="group block rounded-[1.8rem] border border-black bg-[#f7f2e8] p-6 shadow-[6px_6px_0_#111] sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Lead perspective</p>
              <p className="mt-4 text-2xl leading-[1.55] tracking-[-0.02em] text-[#111] sm:text-3xl">
                {getEditableExcerpt(lead, 280) || 'A practical view of distribution choices, timing, and visibility considerations.'}
              </p>
            </Link>

            <div className="mt-8 rounded-[1.8rem] border border-black bg-[#f5efe3] p-8 text-center shadow-[6px_6px_0_#111]">
              <h2 className="editorial-serif text-5xl leading-none tracking-[-0.04em] text-[#111]">Get your communication strategy right</h2>
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-black/68">
                Explore articles, examples, and practical distribution context before your next announcement goes out.
              </p>
              <Link href="/contact" className="mt-7 inline-flex rounded-xl border border-black bg-[#f63a2a] px-8 py-3 text-sm font-semibold text-white">
                Talk to our team
              </Link>
            </div>

            <div className="mt-12">
              <h2 className="editorial-serif text-5xl leading-none tracking-[-0.04em] text-[#111]">What to read next</h2>
              <div className="mt-5 rounded-[1.8rem] border border-black/15 bg-white p-6">
                {briefs.map((post, index) => (
                  <Link key={post.id || post.slug || index} href={postHref(primaryTask, post, primaryRoute)} className="group border-t border-black/15 py-5 first:border-t-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f63a2a]">{getEditableCategoryFallback(post, taskLabel(primaryTask))}</p>
                    <h3 className="editorial-serif mt-2 text-3xl leading-tight tracking-[-0.03em] text-[#111]">{post.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-black/63">{getEditableExcerpt(post, 170)}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[1.4rem] border border-black bg-[#f5efe3] p-5 shadow-[4px_4px_0_#111]">
              <h3 className="editorial-serif text-3xl leading-tight text-[#111]">Explore how we grow modern brands</h3>
              <form action="/contact" className="mt-5 grid gap-3">
                <input name="name" placeholder="Name" className="h-11 border border-black/25 bg-white px-4 text-sm outline-none" />
                <input name="company" placeholder="Company name" className="h-11 border border-black/25 bg-white px-4 text-sm outline-none" />
                <input name="email" placeholder="Business email" className="h-11 border border-black/25 bg-white px-4 text-sm outline-none" />
                <button className="h-11 bg-[#f63a2a] text-sm font-semibold text-white">Learn more</button>
              </form>
            </div>
            <div className="rounded-[1.4rem] border border-black bg-[#f5efe3] p-5 shadow-[4px_4px_0_#111]">
              <h3 className="editorial-serif text-3xl leading-tight text-[#111]">Join our editorial updates</h3>
              <p className="mt-3 text-sm leading-6 text-black/65">Fresh articles, sharper context, and release strategy notes delivered in one stream.</p>
              <Link href="/signup" className="mt-5 inline-flex rounded-xl bg-[#f63a2a] px-5 py-3 text-sm font-semibold text-white">Get updates</Link>
            </div>
          </aside>
        </div>

        <form action="/search" className="mt-14 rounded-[1.8rem] border border-black bg-[#f7d267] px-6 py-10 text-center sm:px-10">
          <h2 className="editorial-serif text-5xl leading-none tracking-[-0.04em] text-[#111]">Do you want to boost your growth with PR?</h2>
          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-black/72">
            Search the archive for examples, explanations, and release-focused reading across every active section of the site.
          </p>
          <label className="mx-auto mt-8 flex max-w-2xl items-center overflow-hidden rounded-xl border border-black bg-white">
            <Search className="ml-4 h-4 w-4 text-black/55" />
            <input name="q" placeholder={pagesContent.home.hero.searchPlaceholder} className="min-w-0 flex-1 px-3 py-4 text-sm outline-none" />
            <button className="bg-[#f63a2a] px-6 py-4 text-sm font-semibold text-white">Search</button>
          </label>
        </form>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[#1f1f1f] text-white">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_auto] lg:px-8 lg:py-20">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f7c96c]">{pagesContent.home.cta.badge}</p>
          <h2 className="editorial-serif mt-4 max-w-4xl text-5xl leading-[0.98] tracking-[-0.05em]">{pagesContent.home.cta.title}</h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/72">{pagesContent.home.cta.description}</p>
        </div>
        <div className="flex flex-col justify-center gap-3">
          <Link href={pagesContent.home.cta.primaryCta.href} className="rounded-xl bg-[#f63a2a] px-7 py-3 text-center text-sm font-semibold text-white">
            {pagesContent.home.cta.primaryCta.label}
          </Link>
          <Link href={pagesContent.home.cta.secondaryCta.href} className="rounded-xl border border-white/20 px-7 py-3 text-center text-sm font-semibold text-white/88">
            {pagesContent.home.cta.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
