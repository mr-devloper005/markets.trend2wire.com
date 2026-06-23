import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Share2, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { getEditableExcerpt } from '@/editable/cards/PostCards'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' || task === 'mediaDistribution' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => getEditableExcerpt(post, 260)
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

function getTableOfContents(post: SitePost) {
  const body = getBody(post)
  const htmlHeadings = Array.from(body.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/gi)).map((match) => match[1].replace(/<[^>]+>/g, '').trim())
  const markdownHeadings = Array.from(body.matchAll(/(?:^|\n)#{2,3}\s+(.+)/g)).map((match) => match[1].trim())
  const lines = body.split('\n').map((line) => line.trim()).filter(Boolean)
  const plain = lines.filter((line) => line.length > 18 && line.length < 90).slice(0, 8)
  return Array.from(new Set([...htmlHeadings, ...markdownHeadings, ...plain])).slice(0, 8)
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = { '--detail-bg': preset.colors.background, '--detail-text': preset.colors.foreground, '--detail-surface': preset.colors.surface, '--detail-accent': preset.colors.accent } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' || task === 'mediaDistribution' ? <ArticleDetail task={task} post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/65 hover:text-[#f63a2a]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function ArticleDetail({ task, post, related, comments }: { task: TaskKey; post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  const published = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''
  const toc = getTableOfContents(post)

  return (
    <section className="bg-[#f6f0e5]">
      <header className="border-b border-black bg-[#f5efe3]">
        <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <BackLink task={task} />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_.92fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-black/65">
                {published ? <time>{published}</time> : null}
                <span>39 min read</span>
              </div>
              <h1 className="editorial-serif mt-5 max-w-4xl text-5xl leading-[1.03] tracking-[-0.05em] text-[#111] sm:text-6xl">{post.title}</h1>
              {summaryText(post) ? <p className="mt-6 max-w-3xl text-xl leading-9 text-black/72">{summaryText(post)}</p> : null}
              <div className="mt-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-black/15 bg-white text-sm font-semibold text-[#111]">MD</div>
                <div>
                  <p className="text-base font-semibold text-[#111]">By Editorial Team</p>
                  <p className="text-sm text-black/58">Independent analysis, practical guidance, and current distribution context.</p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.1rem] border border-black bg-black">
              <img src={images[0] || '/placeholder.svg?height=900&width=1200'} alt={post.title || 'Featured article image'} className="aspect-[16/10] w-full object-cover" />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)_210px]">
          <aside className="rounded-[1.5rem] border border-black/15 bg-white p-5 lg:sticky lg:top-28 lg:self-start">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#111]">Table of contents</p>
            <div className="mt-5 grid gap-4 text-sm leading-6 text-black/68">
              {(toc.length ? toc : ['Overview', 'Key considerations', 'Practical takeaways', 'Related reading']).map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </aside>

          <article className="min-w-0">
            <div className="rounded-[1.7rem] border border-black bg-[#f7f2e8] p-6 shadow-[5px_5px_0_#111] sm:p-8">
              <p className="text-2xl leading-[1.55] tracking-[-0.02em] text-[#111]">
                {summaryText(post) || 'A grounded look at timing, credibility, and the practical choices behind stronger communication outcomes.'}
              </p>
            </div>

            <div className="article-content mt-10 rounded-[1.7rem] bg-white p-6 sm:p-8" dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />

            {images.length > 1 ? <ImageStrip images={images.slice(1)} label="Additional visuals" large /> : null}
            <EditableComments slug={post.slug} comments={comments} />
          </article>

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
              <Link href="/signup" className="mt-5 inline-flex rounded-xl bg-[#f63a2a] px-5 py-3 text-sm font-semibold text-white">Get updates</Link>
            </div>

            <div className="rounded-[1.4rem] border border-black/15 bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/55">Share article</p>
              <div className="mt-4 flex items-center gap-3 text-black/75">
                <Share2 className="h-4 w-4" />
                <span className="text-sm">Copy link, share in chat, or save for later.</span>
              </div>
            </div>

            <RelatedPanel task={task} post={post} related={related} />
          </aside>
        </div>
      </div>
    </section>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)

  return (
    <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <article className="rounded-[1.8rem] border border-black bg-white p-6 shadow-[5px_5px_0_#111] sm:p-8">
          <div className="grid gap-6 sm:grid-cols-[150px_1fr]">
            <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-[1.4rem] border border-black/15 bg-[#f5efe3]">
              {logo ? <img src={logo} alt={post.title || 'Listing image'} className="h-full w-full object-cover" /> : <Building2 className="h-14 w-14 text-black/35" />}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f63a2a]">Business listing</p>
              <h1 className="editorial-serif mt-3 text-5xl leading-[0.98] tracking-[-0.04em] text-[#111]">{post.title}</h1>
              <p className="mt-5 text-lg leading-8 text-black/68">{summaryText(post)}</p>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Business showcase" />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" post={post} related={related} compact />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])

  return (
    <section className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8 lg:py-14">
      <aside className="rounded-[1.8rem] border border-black bg-[#111] p-6 text-white shadow-[5px_5px_0_#000] lg:sticky lg:top-28 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.24em] text-white/65">Classified notice</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight">{post.title}</h1>
        <div className="mt-6 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
      </aside>
      <article className="rounded-[1.8rem] border border-black bg-white p-6 shadow-[5px_5px_0_#111] sm:p-8">
        <ImageStrip images={images} label="Offer images" large />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_1fr]">
        <aside className="rounded-[1.8rem] border border-black bg-white p-6 lg:sticky lg:top-28 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#111] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white"><Camera className="h-4 w-4" /> Image story</div>
          <h1 className="editorial-serif mt-5 text-5xl leading-[0.98] tracking-[-0.04em] text-[#111]">{post.title}</h1>
          <p className="mt-5 text-base leading-8 text-black/68">{summaryText(post)}</p>
          <BodyContent post={post} compact />
        </aside>
        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-[1.6rem] border border-black/15 bg-white shadow-sm">
              <img src={image} alt={post.title || 'Image post'} className="w-full object-cover" />
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10"><RelatedPanel task="image" post={post} related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-14">
      <article className="rounded-[1.8rem] border border-black bg-white p-6 shadow-[5px_5px_0_#111] sm:p-8">
        <BackLink task="sbm" />
        <div className="mt-8 flex h-20 w-20 items-center justify-center rounded-[1.4rem] bg-[#111] text-white"><Bookmark className="h-8 w-8" /></div>
        <h1 className="editorial-serif mt-6 text-5xl leading-[0.98] tracking-[-0.04em] text-[#111]">{post.title}</h1>
        <p className="mt-5 text-lg leading-9 text-black/68">{summaryText(post)}</p>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#111] px-5 py-3 text-sm font-semibold text-white">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
        <BodyContent post={post} />
      </article>
      <RelatedPanel task="sbm" post={post} related={related} />
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-14">
      <article className="rounded-[1.8rem] border border-black bg-white p-6 shadow-[5px_5px_0_#111] sm:p-8">
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 sm:grid-cols-[120px_1fr]">
          <div className="flex h-28 w-28 items-center justify-center rounded-[1.4rem] bg-[#111] text-white"><FileText className="h-12 w-12" /></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f63a2a]">PDF resource</p>
            <h1 className="editorial-serif mt-3 text-5xl leading-[0.98] tracking-[-0.04em] text-[#111]">{post.title}</h1>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-[1.6rem] border border-black/15 bg-[#f5efe3]">
            <div className="flex items-center justify-between gap-3 border-b border-black/15 bg-white p-4">
              <span className="text-sm font-semibold text-[#111]">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#111] px-4 py-2 text-xs font-semibold text-white">Download <Download className="h-4 w-4" /></Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
          </div>
        ) : null}
      </article>
      <RelatedPanel task="pdf" post={post} related={related} />
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[1240px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8 lg:py-14">
      <aside className="rounded-[1.8rem] border border-black bg-white p-6 text-center shadow-[5px_5px_0_#111] lg:sticky lg:top-28 lg:self-start">
        <BackLink task="profile" />
        <div className="mx-auto mt-8 flex h-40 w-40 items-center justify-center overflow-hidden rounded-full border border-black/15 bg-[#f5efe3]">
          {images[0] ? <img src={images[0]} alt={post.title || 'Profile image'} className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 text-black/35" />}
        </div>
        <h1 className="mt-6 text-4xl font-semibold leading-tight text-[#111]">{post.title}</h1>
        {role ? <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#f63a2a]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className="rounded-[1.8rem] border border-black bg-white p-6 shadow-[5px_5px_0_#111] sm:p-8">
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Profile gallery" />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'}`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.2rem] border border-black/15 bg-[#f5efe3] p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-black/55"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm leading-6 text-black/75">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt={label} className="aspect-[4/3] rounded-[1.2rem] border border-black/10 object-cover" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[1.6rem] border border-black bg-white shadow-[4px_4px_0_#111]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold text-[#111]"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[1.6rem] border border-black/15 bg-white p-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/55">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#111] px-4 py-2 text-sm font-semibold text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-xl border border-black/15 px-4 py-2 text-sm font-semibold text-[#111]"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-xl border border-black/15 px-4 py-2 text-sm font-semibold text-[#111]"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-xl border border-white/12 bg-white/8 px-4 py-3 text-sm"><span className="font-semibold uppercase tracking-[0.12em] text-white/60">{label}</span><span className="font-semibold">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="space-y-5">
      {!compact ? (
        <div className="rounded-[1.4rem] border border-black/15 bg-white p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-black/55">About this post</p>
          <div className="mt-4 grid gap-3 text-sm text-black/75">
            <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4" /> Task: {taskConfig?.label || task}</p>
            <p className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Site: {SITE_CONFIG.name}</p>
            {post.publishedAt ? <p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p> : null}
          </div>
        </div>
      ) : null}
      {related.length ? (
        <div className="rounded-[1.4rem] border border-black/15 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-[#111]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-semibold uppercase tracking-[0.14em] text-black/55">View all</Link>
          </div>
          <div className="mt-4 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 border-t border-black/10 py-3 first:border-t-0 hover:text-[#f63a2a]">
      {image && task !== 'sbm' ? <img src={image} alt={post.title || 'Related post'} className="h-20 w-20 shrink-0 rounded-[1rem] object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[1rem] bg-[#111] text-white"><FileText className="h-6 w-6" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-semibold leading-tight text-[#111] group-hover:text-[#f63a2a]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-black/58">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-12 rounded-[1.7rem] border border-black/15 bg-white p-6">
      <div className="flex items-center gap-2 text-lg font-semibold text-[#111]"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="border-t border-black/10 py-4 first:border-t-0">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#111]">{comment.name}</p>
              <p className="text-xs text-black/45">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ''}</p>
            </div>
            <p className="mt-2 text-sm leading-7 text-black/68">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-black/58">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
