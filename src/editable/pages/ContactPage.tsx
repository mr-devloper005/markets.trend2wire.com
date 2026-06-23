'use client'

import { FileText, Mail, Megaphone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const desks = [
  { icon: FileText, title: 'Editorial desk', body: 'Send story ideas, corrections, source material, and publication questions.' },
  { icon: Megaphone, title: 'Media partnerships', body: 'Discuss distribution, syndication, newsroom collaborations, and campaigns.' },
  { icon: Mail, title: 'General support', body: 'Reach the team for account, publishing, or site-related help.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f6f0e5] text-[#111]">
        <section className="border-b border-black bg-[#f5efe3]">
          <div className="mx-auto max-w-[980px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#f63a2a]">{pagesContent.contact.eyebrow}</p>
            <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
              <div>
                <h1 className="editorial-serif max-w-3xl text-5xl leading-[1.02] tracking-[-0.045em] text-[#111] sm:text-6xl">
                  {pagesContent.contact.title}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-black/70">{pagesContent.contact.description}</p>
              </div>
              <div className="rounded-[1.5rem] border border-black bg-white p-6 shadow-[4px_4px_0_#111]">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Response lanes</p>
                <p className="mt-4 text-base leading-8 text-black/72">
                  Use the message form for release planning, editorial questions, account support, or general site follow-up.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[980px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[.92fr_1.08fr]">
            <aside className="space-y-5">
              {desks.map((desk, index) => (
                <div key={desk.title} className="rounded-[1.4rem] border border-black/15 bg-white p-6">
                  <div className="flex items-center justify-between">
                    <desk.icon className="h-5 w-5 text-[#f63a2a]" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-black/45">0{index + 1}</span>
                  </div>
                  <h2 className="editorial-serif mt-4 text-3xl leading-tight tracking-[-0.03em] text-[#111]">{desk.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-black/65">{desk.body}</p>
                </div>
              ))}
            </aside>

            <div className="rounded-[1.7rem] border border-black bg-white p-6 shadow-[5px_5px_0_#111] sm:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f63a2a]">Send a message</p>
              <h2 className="editorial-serif mt-3 text-4xl leading-none tracking-[-0.03em] text-[#111]">{pagesContent.contact.formTitle}</h2>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
