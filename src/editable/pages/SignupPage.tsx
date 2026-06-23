import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f6f0e5] text-[#111]">
        <section className="border-b border-black bg-[#f5efe3]">
          <div className="mx-auto max-w-[980px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#f63a2a]">{pagesContent.auth.signup.badge}</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
              <div>
                <h1 className="editorial-serif max-w-3xl text-5xl leading-[1.02] tracking-[-0.045em] text-[#111] sm:text-6xl">
                  {pagesContent.auth.signup.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">{pagesContent.auth.signup.description}</p>
              </div>
              <div className="rounded-[1.5rem] border border-black bg-white p-6 shadow-[4px_4px_0_#111]">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Create access</p>
                <p className="mt-4 text-base leading-8 text-black/72">
                  Set up your account to access member actions, maintain a session, and move more smoothly across the site.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[980px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.02fr_.98fr]">
            <div className="rounded-[1.7rem] border border-black bg-white p-6 shadow-[5px_5px_0_#111] sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Create account</p>
              <h2 className="editorial-serif mt-3 text-4xl leading-none tracking-[-0.03em] text-[#111]">{pagesContent.auth.signup.formTitle}</h2>
              <EditableLocalSignupForm />
              <p className="mt-6 border-t border-black/10 pt-5 text-sm text-black/65">
                Already have an account? <Link href="/login" className="font-semibold text-[#f63a2a] underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link>
              </p>
            </div>

            <aside className="rounded-[1.5rem] border border-black/15 bg-white p-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">What you get</p>
              <div className="mt-4 space-y-5 text-sm leading-7 text-black/68">
                <p>Create an account to save your session locally and open the member-facing workflows supported on this site.</p>
                <p>The sign-up flow stays lightweight, direct, and aligned with the same cleaner editorial UI used across the rest of the experience.</p>
              </div>
              <Link href="/about" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-black/15 bg-[#f5efe3] px-5 py-3 text-sm font-semibold text-[#111]">
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
