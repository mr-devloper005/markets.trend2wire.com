import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Newspaper, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { getEditableExcerpt } from '@/editable/cards/PostCards'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => getEditableExcerpt(post, 220)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; badge: string }> = {
  mediaDistribution: { icon: Newspaper, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', badge: 'Media distribution' },
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', badge: 'Article' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', badge: 'Listing' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', badge: 'Classified' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', badge: 'Image' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = { '--archive-bg': preset.colors.background, '--archive-text': preset.colors.foreground, '--archive-surface': preset.colors.surface, '--archive-accent': preset.colors.accent } as CSSProperties
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getCategory(post, '')
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category

  if (task === 'mediaDistribution' || task === 'article') {
    return (
      <EditorialArchive
        task={task}
        posts={posts}
        pagination={pagination}
        category={category}
        categoryLabel={categoryLabel}
        categories={dynamicCategories}
        basePath={basePath}
        label={label}
      />
    )
  }

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="rounded-[2rem] border border-black bg-[#f5efe3] p-8 shadow-[6px_6px_0_#111]">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#f63a2a]">
                <Icon className="h-4 w-4" /> {deck.badge}
              </div>
              <h1 className="editorial-serif mt-5 text-5xl leading-[0.98] tracking-[-0.045em] text-[#111] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-black/68">{voice?.description || SITE_CONFIG.description}</p>
            </div>
            <form action={basePath} className="rounded-[1.6rem] border border-black bg-white p-5 shadow-[4px_4px_0_#111]">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-black/55"><Filter className="h-4 w-4" /> Filter</div>
              <select name="category" defaultValue={category} className="mt-4 h-12 w-full border border-black/20 bg-[#f8f4ea] px-4 text-sm outline-none">
                <option value="all">All categories</option>
                {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-3 h-12 w-full bg-[#f63a2a] text-sm font-semibold text-white">Apply</button>
              <p className="mt-3 text-xs text-black/55">Showing: {categoryLabel}</p>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <EmptyArchive />
          )}

          <Pagination pagination={pagination} page={page} basePath={basePath} category={category} />
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchive({
  task,
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
}) {
  const page = pagination.page || 1
  const lead = posts[0]
  const secondary = posts.slice(1, 3)
  const rail = posts.slice(3, 7)
  const grid = posts.slice(7)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#f6f0e5] text-[#111]">
        <section className="border-b border-black bg-[#f5efe3]">
          <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#f63a2a]">{task === 'mediaDistribution' ? 'Media distribution' : 'Editorial archive'}</p>
                <h1 className="editorial-serif mt-4 text-5xl leading-[0.95] tracking-[-0.05em] text-[#111] sm:text-7xl">
                  {category === 'all' ? label : categoryLabel}
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-black/68">
                  Practical reading, stronger organization, and current posts presented in a guide-like editorial format.
                </p>
              </div>
              <form action={basePath} className="rounded-[1.6rem] border border-black bg-white p-5 shadow-[4px_4px_0_#111]">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-black/55"><Filter className="h-4 w-4" /> Filter archive</div>
                <select name="category" defaultValue={category} className="mt-4 h-12 w-full border border-black/20 bg-[#f8f4ea] px-4 text-sm outline-none">
                  <option value="all">All categories</option>
                  {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                </select>
                <button className="mt-3 h-12 w-full bg-[#f63a2a] text-sm font-semibold text-white">Apply</button>
                <p className="mt-3 text-xs text-black/55">Showing: {categoryLabel}</p>
              </form>
            </div>
          </div>
        </section>

        <section className="border-b border-black bg-white">
          <div className="mx-auto flex max-w-[1240px] gap-6 overflow-x-auto px-4 py-4 text-sm font-medium sm:px-6 lg:px-8">
            <Link href={basePath} className={category === 'all' ? 'text-[#f63a2a]' : 'text-black/75 hover:text-[#f63a2a]'}>Latest</Link>
            {categories.slice(0, 8).map((item) => (
              <Link key={item.slug} href={pageHref(basePath, item.slug, 1)} className={category === item.slug ? 'text-[#f63a2a]' : 'whitespace-nowrap text-black/75 hover:text-[#f63a2a]'}>
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        {lead ? (
          <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <div className="grid gap-8">
                <div className="grid gap-8 rounded-[1.9rem] border border-black bg-[#f5efe3] p-6 lg:grid-cols-[1fr_.95fr] lg:items-center">
                  <div>
                    <p className="text-sm text-black/62">
                      Updated guidance · {lead.publishedAt ? new Date(lead.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Latest post'}
                    </p>
                    <h2 className="editorial-serif mt-4 text-4xl leading-[1.03] tracking-[-0.04em] text-[#111] sm:text-6xl">{lead.title}</h2>
                    <p className="mt-5 max-w-2xl text-lg leading-8 text-black/72">{getSummary(lead)}</p>
                    <Link href={`${basePath}/${lead.slug}`} className="mt-7 inline-flex rounded-xl border border-black bg-[#f63a2a] px-6 py-3 text-sm font-semibold text-white shadow-[3px_3px_0_#111]">
                      Read full article
                    </Link>
                  </div>
                  <div className="overflow-hidden rounded-[1.2rem] border border-black bg-black">
                    <img src={getImage(lead)} alt={lead.title || 'Lead archive image'} className="aspect-[16/11] w-full object-cover" />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {secondary.map((post, index) => (
                    <Link key={post.id || post.slug || index} href={`${basePath}/${post.slug}`} className="group overflow-hidden rounded-[1.6rem] border border-black/15 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,.12)]">
                      <div className="aspect-[16/10] overflow-hidden bg-black">
                        <img src={getImage(post)} alt={post.title || 'Secondary article image'} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                      </div>
                      <div className="p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f63a2a]">{index === 0 ? 'Compact feature' : 'Image first'}</p>
                        <h3 className="editorial-serif mt-3 text-3xl leading-tight tracking-[-0.03em] text-[#111]">{post.title}</h3>
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-black/63">{getSummary(post)}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {!!grid.length && (
                  <div className="rounded-[1.8rem] border border-black/15 bg-white p-6">
                    <div className="flex items-end justify-between gap-5 border-b border-black pb-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Latest articles</p>
                        <h2 className="editorial-serif mt-2 text-5xl leading-none tracking-[-0.04em] text-[#111]">More from the archive</h2>
                      </div>
                      <Link href={basePath} className="hidden text-sm font-semibold text-black/70 hover:text-[#f63a2a] sm:inline-flex">
                        View all <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                      {grid.map((post, index) => (
                        <Link key={post.id || post.slug || index} href={`${basePath}/${post.slug}`} className="group overflow-hidden rounded-[1.5rem] border border-black/15 bg-[#faf7f0]">
                          <div className="aspect-[16/10] overflow-hidden bg-black">
                            <img src={getImage(post)} alt={post.title || 'Archive article image'} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                          </div>
                          <div className="p-5">
                            <div className="flex items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f63a2a]">
                              <span>{getCategory(post, label)}</span>
                              <span>{String(index + 1).padStart(2, '0')}</span>
                            </div>
                            <h3 className="editorial-serif mt-4 text-2xl leading-tight tracking-[-0.03em] text-[#111]">{post.title}</h3>
                            <p className="mt-3 line-clamp-3 text-sm leading-7 text-black/63">{getSummary(post)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {!secondary.length && !grid.length ? <EmptyArchive /> : null}
              </div>

              <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
                <div className="rounded-[1.4rem] border border-black bg-[#f5efe3] p-5 shadow-[4px_4px_0_#111]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/60">Table of contents</p>
                  <div className="mt-4 grid gap-3 text-sm leading-6 text-black/70">
                    {rail.slice(0, 5).map((post) => (
                      <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className="hover:text-[#f63a2a]">
                        {post.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.4rem] border border-black bg-[#f5efe3] p-5 shadow-[4px_4px_0_#111]">
                  <h3 className="editorial-serif text-3xl leading-tight text-[#111]">Explore how we grow modern brands</h3>
                  <form action="/contact" className="mt-5 grid gap-3">
                    <input name="name" placeholder="Name" className="h-11 border border-black/25 bg-white px-4 text-sm outline-none" />
                    <input name="company" placeholder="Company name" className="h-11 border border-black/25 bg-white px-4 text-sm outline-none" />
                    <input name="email" placeholder="Business email" className="h-11 border border-black/25 bg-white px-4 text-sm outline-none" />
                    <button className="h-11 bg-[#f63a2a] text-sm font-semibold text-white">Learn more</button>
                  </form>
                </div>
              </aside>
            </div>
          </section>
        ) : (
          <section className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 lg:px-8">
            <EmptyArchive />
          </section>
        )}

        <section className="mx-auto max-w-[1240px] px-4 pb-16 sm:px-6 lg:px-8">
          <Pagination pagination={pagination} page={page} basePath={basePath} category={category} />
        </section>
      </main>
    </EditableSiteShell>
  )
}

function Pagination({ pagination, page, basePath, category }: { pagination: SiteFeedPagination; page: number; basePath: string; category: string }) {
  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
      {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-xl border border-black bg-white px-5 py-3 text-sm font-semibold">Previous</Link> : null}
      <span className="rounded-xl bg-[#f63a2a] px-5 py-3 text-sm font-semibold text-white">Page {page} of {pagination.totalPages || 1}</span>
      {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-xl border border-black bg-white px-5 py-3 text-sm font-semibold">Next</Link> : null}
    </div>
  )
}

function EmptyArchive() {
  return (
    <div className="rounded-[1.8rem] border border-dashed border-black/25 bg-white p-12 text-center">
      <Search className="mx-auto h-8 w-8 text-black/45" />
      <h2 className="editorial-serif mt-4 text-4xl text-[#111]">No posts found</h2>
      <p className="mt-2 text-sm text-black/60">Try another category or refresh this page after new posts are published.</p>
    </div>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <GenericArchiveCard post={post} href={href} index={index} />
}

function GenericArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.7rem] border border-black/15 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,.12)]">
      <div className="aspect-[4/3] overflow-hidden bg-black">
        <img src={getImage(post)} alt={post.title || 'Archive image'} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f63a2a]">
          <span>{getCategory(post, 'Story')}</span><span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h2 className="editorial-serif mt-4 text-3xl leading-tight tracking-[-0.03em] text-[#111]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-black/63">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[1.8rem] border border-black/15 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,.12)] sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.3rem] border border-black/15 bg-[#f5efe3]">
        {logo ? <img src={logo} alt={post.title || 'Listing image'} className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 text-black/40" />}
      </div>
      <div>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#111] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-black/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.03em] text-[#111]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-black/63">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs text-black/60 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.8rem] border border-black/15 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,.12)]">
      <div className="grid min-h-64 sm:grid-cols-[0.8fr_1fr]">
        <div className="relative bg-[#111] p-5 text-white">
          <span className="rounded-full bg-white/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">Classified</span>
          <h2 className="mt-8 text-3xl font-semibold leading-tight">{price || 'Open offer'}</h2>
          <p className="mt-3 text-sm text-white/70">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt={post.title || 'Classified image'} className="absolute bottom-4 right-4 h-20 w-20 rounded-[1rem] object-cover" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold leading-tight text-[#111]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/63">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f63a2a]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[1.7rem] border border-black/15 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,.12)]">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={getImage(post)} alt={post.title || 'Image post'} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#f5efe3] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#111]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-semibold leading-tight text-[#111]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.6rem] border border-black/15 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:bg-[#111] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-semibold leading-tight">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-semibold uppercase tracking-[0.14em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group rounded-[1.7rem] border border-black/15 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.2rem] bg-[#111] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[#f5efe3] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#111]">{getCategory(post, 'PDF')}</span>
      </div>
      <h2 className="mt-8 text-2xl font-semibold leading-tight text-[#111]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/63">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#f63a2a]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[1.7rem] border border-black/15 bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,.12)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-black/15 bg-[#f5efe3]">
        {avatar ? <img src={avatar} alt={post.title || 'Profile image'} className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 text-black/40" />}
      </div>
      <h2 className="mt-5 text-xl font-semibold leading-tight text-[#111]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-[#f63a2a]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-7 text-black/63">{getSummary(post)}</p>
    </Link>
  )
}
