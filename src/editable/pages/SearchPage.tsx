import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link
      href={href}
      className={`group rounded-[1.5rem] border border-black/15 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,.12)] ${strong ? 'md:col-span-2' : ''}`}
    >
      <span className="rounded-full bg-[#f63a2a] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">{taskLabel}</span>
      <h2 className={`editorial-serif mt-4 line-clamp-3 tracking-[-0.03em] text-[#111] ${strong ? 'text-3xl leading-[1.04]' : 'text-2xl leading-[1.05]'}`}>{post.title}</h2>
      {summary ? <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/65">{summary}</p> : null}
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/60 group-hover:text-[#f63a2a]">Open result <ArrowRight className="h-4 w-4" /></span>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#f6f0e5] text-[#111]">
        <section className="border-b border-black bg-[#f5efe3]">
          <div className="mx-auto max-w-[980px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#f63a2a]">{pagesContent.search.hero.badge}</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
              <div>
                <h1 className="editorial-serif max-w-3xl text-5xl leading-[1.02] tracking-[-0.045em] text-[#111] sm:text-6xl">
                  {pagesContent.search.hero.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">{pagesContent.search.hero.description}</p>
              </div>
              <div className="rounded-[1.5rem] border border-black bg-white p-6 shadow-[4px_4px_0_#111]">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Search focus</p>
                <p className="mt-4 text-base leading-8 text-black/72">
                  Find guides, articles, resources, and supporting posts through one cleaner archive surface.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[980px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <form action="/search" className="rounded-[1.7rem] border border-black bg-white p-6 shadow-[5px_5px_0_#111] sm:p-8">
              <input type="hidden" name="master" value="1" />
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Search the archive</p>
              <label className="mt-5 flex items-center gap-3 rounded-[1rem] border border-black/15 bg-[#f8f3ea] px-4 py-4">
                <Search className="h-5 w-5 text-black/45" />
                <input
                  name="q"
                  defaultValue={query}
                  placeholder={pagesContent.search.hero.placeholder}
                  className="min-w-0 flex-1 bg-transparent text-base font-medium outline-none placeholder:text-black/35"
                />
              </label>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-[1rem] border border-black/15 bg-[#f8f3ea] px-4 py-4">
                  <Filter className="h-4 w-4 text-black/45" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-black/35" />
                </label>
                <select name="task" defaultValue={task} className="rounded-[1rem] border border-black/15 bg-[#f8f3ea] px-4 py-4 text-sm font-medium outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-xl border border-black bg-[#f63a2a] px-6 text-sm font-semibold text-white shadow-[3px_3px_0_#111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none" type="submit">
                Search
              </button>
            </form>

            <aside className="rounded-[1.5rem] border border-black/15 bg-white p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">{results.length} results</p>
              <h2 className="editorial-serif mt-3 text-4xl leading-none tracking-[-0.04em] text-[#111]">
                {query ? `Results for "${query}"` : pagesContent.search.resultsTitle}
              </h2>
              <p className="mt-4 text-sm leading-7 text-black/65">
                Use the keyword field, category filter, and content type selector to narrow the archive faster.
              </p>
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-[980px] px-4 pb-14 sm:px-6 lg:px-8 lg:pb-16">
          {results.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[1.7rem] border border-dashed border-black/20 bg-white p-10 text-center">
              <p className="editorial-serif text-4xl leading-none tracking-[-0.03em] text-[#111]">No matching posts found.</p>
              <p className="mt-3 text-sm leading-7 text-black/60">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
