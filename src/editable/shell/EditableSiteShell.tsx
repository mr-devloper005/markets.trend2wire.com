import type { ReactNode } from 'react'
import { EditableNavbar } from '@/editable/shell/EditableNavbar'
import { EditableFooter } from '@/editable/shell/EditableFooter'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'

export function EditableSiteShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`${dc.shell.page} flex min-h-screen flex-col ${className}`}>
      <EditableNavbar />
      <div className="min-h-0 flex-1">{children}</div>
      <div className="pointer-events-none fixed bottom-4 right-4 z-40 hidden xl:block">
        <div className="pointer-events-auto w-[300px] rounded-2xl border border-black/20 bg-white p-4 shadow-[0_14px_40px_rgba(0,0,0,.12)]">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-[#f3ede2]">
              <img src="/favicon.png" alt="Site logo" className="h-10 w-10 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#f63a2a]">PR FOR GROWTH</p>
              <p className="mt-1 text-sm leading-6 text-black/75">Ready for real impact? Click here to start.</p>
            </div>
          </div>
        </div>
      </div>
      <EditableFooter />
    </div>
  )
}
