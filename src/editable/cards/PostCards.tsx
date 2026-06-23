import Link from 'next/link'
import { ArrowRight, Clock3 } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((value): value is string => typeof value === 'string' && Boolean(value))
  const directImage = ['featuredImage', 'image', 'thumbnail', 'coverImage', 'logo']
    .map((key) => content[key])
    .find((value): value is string => typeof value === 'string' && Boolean(value))
  return mediaUrl || directImage || contentImage || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.body === 'string' && content.body) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Latest'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

export function EditorialFeatureCard({ post, href, label = 'Lead story' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[2rem] border border-black bg-white">
      <div className="grid lg:grid-cols-[1.05fr_.95fr]">
        <div className="order-2 flex flex-col justify-center p-6 sm:p-8 lg:order-1 lg:p-10">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#f63a2a]">{label}</p>
          <h3 className="editorial-serif mt-4 text-4xl leading-[1] tracking-[-0.045em] text-[#111] sm:text-5xl">{post.title}</h3>
          <p className="mt-5 max-w-xl text-base leading-8 text-black/70">{getEditableExcerpt(post, 210)}</p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#111]">Read article <ArrowRight className="h-4 w-4" /></span>
        </div>
        <div className="order-1 aspect-[4/3] overflow-hidden bg-black lg:order-2 lg:aspect-auto">
          <img src={getEditablePostImage(post)} alt={post.title || 'Featured post image'} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        </div>
      </div>
    </Link>
  )
}

export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-[1.7rem] border border-black/15 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,.12)]">
      <div className="aspect-[4/3] overflow-hidden bg-black">
        <img src={getEditablePostImage(post)} alt={post.title || 'Post image'} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#f63a2a]">
          <span>{getEditableCategory(post)}</span>
          <span>{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className="mt-3 line-clamp-3 text-xl font-semibold leading-tight tracking-[-0.03em] text-[#111]">{post.title}</h3>
      </div>
    </Link>
  )
}

export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid grid-cols-[44px_1fr] gap-4 border-t border-black/15 py-5 first:border-t-0">
      <span className="text-3xl font-semibold leading-none text-[#f63a2a]">{String(index + 1).padStart(2, '0')}</span>
      <div>
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/50">
          <Clock3 className="h-3 w-3" />
          {getEditableCategory(post)}
        </p>
        <h3 className="mt-2 line-clamp-3 text-lg font-semibold leading-tight tracking-[-0.02em] text-[#111] transition group-hover:text-[#f63a2a]">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid border-t border-black/15 py-6 sm:grid-cols-[250px_minmax(0,1fr)] sm:gap-7">
      <div className="aspect-[16/10] overflow-hidden rounded-[1.3rem] bg-black">
        <img src={getEditablePostImage(post)} alt={post.title || 'Post image'} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="pt-4 sm:pt-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f63a2a]">{String(index + 1).padStart(2, '0')} / {getEditableCategory(post)}</p>
        <h2 className="editorial-serif mt-3 line-clamp-3 text-3xl leading-[1.06] tracking-[-0.035em] text-[#111] transition group-hover:text-[#f63a2a]">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-black/65">{getEditableExcerpt(post, 190)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#111]">Read story <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}
