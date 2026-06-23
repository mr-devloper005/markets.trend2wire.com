import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f6f0e5] text-[#111]">
        <section className="border-b border-black bg-[#f5efe3]">
          <div className="mx-auto max-w-[980px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#f63a2a]">{pagesContent.auth.login.badge}</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
              <div>
                <h1 className="editorial-serif max-w-3xl text-5xl leading-[1.02] tracking-[-0.045em] text-[#111] sm:text-6xl">
                  {pagesContent.auth.login.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">{pagesContent.auth.login.description}</p>
              </div>
              <div className="rounded-[1.5rem] border border-black bg-white p-6 shadow-[4px_4px_0_#111]">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Member access</p>
                <p className="mt-4 text-base leading-8 text-black/72">
                  Sign in to continue browsing, manage your saved session, and access publishing tools when available.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[980px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_.98fr]">
            <div className="rounded-[1.7rem] border border-black bg-white p-6 shadow-[5px_5px_0_#111] sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Log in</p>
              <h2 className="editorial-serif mt-3 text-4xl leading-none tracking-[-0.03em] text-[#111]">{pagesContent.auth.login.formTitle}</h2>
              <EditableLocalLoginForm />
              <p className="mt-6 border-t border-black/10 pt-5 text-sm text-black/65">
                New here? <Link href="/signup" className="font-semibold text-[#f63a2a] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link>
              </p>
            </div>

            <aside className="rounded-[1.5rem] border border-black/15 bg-white p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Why sign in</p>
              <div className="mt-4 space-y-5 text-sm leading-7 text-black/68">
                <p>Return to your account, continue where you left off, and keep access to the site&apos;s member-facing tools.</p>
                <p>Use your session to move faster between reading, account actions, and supported publishing flows.</p>
              </div>
              <Link href="/search" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-black/15 bg-[#f5efe3] px-5 py-3 text-sm font-semibold text-[#111]">
                Search the archive <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
