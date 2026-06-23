'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function FooterMark() {
  return (
    <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white">
      <img src="/favicon.png" alt="Site logo" className="h-11 w-11 object-contain" />
    </span>
  )
}

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="border-t-[3px] border-[#f63a2a] bg-[#1e1e1e] text-white">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr_1fr_1fr] lg:gap-20">
          <div className="flex items-center gap-4">
            <FooterMark />
            <div>
              <p className="text-2xl font-black tracking-[-0.04em]">{SITE_CONFIG.name}</p>
              <p className="mt-1 text-sm text-white/65">{globalContent.footer.tagline}</p>
            </div>
          </div>

          {globalContent.footer.columns.filter((column) => column.title && column.links.length).map((column) => (
            <div key={column.title}>
              <h3 className="text-lg font-semibold">{column.title}</h3>
              <div className="mt-5 grid gap-3">
                {column.links.map((link) => (
                  <Link key={link.href + link.label} href={link.href} className="text-sm text-white/70 transition hover:text-[#f7c96c]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-white/55">
          <p>© {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}</p>
        </div>
      </div>
    </footer>
  )
}
