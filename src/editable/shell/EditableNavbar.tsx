'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

function BrandMark() {
  return (
    <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-black/15 bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,.08)]">
      <img src="/favicon.png" alt="Site logo" className="h-10 w-10 object-contain" />
    </span>
  )
}

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const navLinks = [
    { label: 'About', href: '/about' },
    { label: 'Search', href: '/search' },
    { label: 'Sign up', href: '/signup' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-black bg-[#f5efe3] text-[#111] shadow-[0_1px_0_rgba(0,0,0,.08)]">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[86px] items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/20 bg-white lg:hidden"
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-4">
              <BrandMark />
              <div className="hidden sm:block">
                <p className="text-lg font-black tracking-[-0.04em]">{SITE_CONFIG.name}</p>
                <p className="text-xs uppercase tracking-[0.22em] text-black/55">Media distribution</p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="inline-flex min-h-[42px] items-center text-[15px] font-medium text-black transition hover:text-[#f63a2a]">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={session ? '/create' : globalContent.nav.actions.primary.href}
              className="hidden min-h-[48px] items-center rounded-[18px] border-2 border-black bg-[#ff4a3b] px-6 text-sm font-semibold text-white shadow-[2px_2px_0_#111] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none sm:inline-flex"
            >
              {session ? 'Publish update' : globalContent.nav.actions.primary.label}
            </Link>
            {session ? (
              <button type="button" onClick={logout} className="hidden min-h-[42px] items-center text-sm font-medium text-black/80 hover:text-[#f63a2a] md:inline-flex">
                Logout
              </button>
            ) : (
              <Link href="/login" className="hidden min-h-[42px] items-center text-sm font-medium text-black/80 hover:text-[#f63a2a] md:inline-flex">
                Log in
              </Link>
            )}
            <div className="hidden h-9 min-w-[46px] items-center justify-center rounded-full border border-black/10 bg-white px-3 text-xs font-bold text-[#f63a2a] md:flex">
              US
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-black" />
      <div className="h-[3px] w-28 bg-[#f63a2a]" />

      {open ? (
        <div className="border-t border-black/10 bg-[#f5efe3] px-4 py-5 lg:hidden">
          <nav className="grid gap-3">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold">
                {item.label}
              </Link>
            ))}
            <Link href="/search" onClick={() => setOpen(false)} className="inline-flex items-center gap-2 rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold">
              <Search className="h-4 w-4" /> Search archive
            </Link>
            {session ? (
              <>
                <Link href="/create" onClick={() => setOpen(false)} className="rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold">
                  Publish update
                </Link>
                <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-2xl border border-black/15 bg-white px-4 py-3 text-left text-sm font-semibold">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/contact" onClick={() => setOpen(false)} className="rounded-2xl bg-[#f63a2a] px-4 py-3 text-sm font-semibold text-white">
                  Talk with an expert
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-2xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      ) : null}
    </header>
  )
}
