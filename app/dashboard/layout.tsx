// app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', icon: 'grid' },
  { href: '/dashboard/crm', label: 'CRM', icon: 'users' },
  { href: '/dashboard/rendez-vous', label: 'Rendez-vous', icon: 'calendar' },
  { href: '/dashboard/whatsapp', label: 'WhatsApp IA', icon: 'message' },
  { href: '/dashboard/automatisations', label: 'Automatisations', icon: 'zap' },
  { href: '/dashboard/equipe', label: 'Equipe', icon: 'team' },
  { href: '/dashboard/facturation', label: 'Facturation', icon: 'card' },
  { href: '/dashboard/parametres', label: 'Parametres', icon: 'settings' },
]

function NavIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/></svg>,
    users: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><path d="M11 7.5c1.5 0 3 1.2 3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/><circle cx="11" cy="4.5" r="2" stroke="currentColor" strokeWidth="1.5"/></svg>,
    calendar: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="2" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M5 1v3M11 1v3M1 7h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    message: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4a1 1 0 011-1h10a1 1 0 011 1v7a1 1 0 01-1 1H5l-3 2V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    zap: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M9 1L3 9h5l-1 6 7-9H9L10 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>,
    team: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="3" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/><circle cx="13" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M1 13.5c0-1.657 1.343-3 3-3h8c1.657 0 3 1.343 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
    card: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1 7h14" stroke="currentColor" strokeWidth="1.5"/></svg>,
    settings: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  }
  return <>{icons[name]}</>
}

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth().catch(() => null)
  if (!session) redirect('/connexion')

  const clinic = await prisma.clinic.findFirst({
    where: { userId: session.user.id },
    include: { subscription: true },
  })

  if (!clinic) redirect('/inscription')

  return (
    <div className="flex h-screen bg-[#F7F8FA]">

      {/* SIDEBAR */}
      <aside className="w-[240px] min-h-screen bg-white border-r border-[rgba(12,14,18,0.06)] flex flex-col flex-shrink-0 sticky top-0">

        {/* Logo */}
        <div className="h-14 flex items-center gap-2.5 px-5 border-b border-[rgba(12,14,18,0.06)]">
          <div className="w-7 h-7 bg-[#0C0E12] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white" opacity=".5"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white" opacity=".5"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white"/>
            </svg>
          </div>
          <span className="font-bold text-sm tracking-wide text-[#0C0E12]">BOS</span>
        </div>

        {/* Clinic info */}
        <div className="px-4 py-3 border-b border-[rgba(12,14,18,0.06)]">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F7F8FA] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#1A56FF] text-sm font-bold flex-shrink-0">
              {clinic.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#0C0E12] truncate">{clinic.name}</div>
              <div className="text-[10px] text-[#1A56FF] bg-[#EEF2FF] px-1.5 py-0.5 rounded-full inline-block mt-0.5 font-medium">
                {clinic.subscription?.plan || 'STARTER'}
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-[#3A3D45] hover:bg-[#F7F8FA] hover:text-[#0C0E12] transition-all group"
            >
              <span className="text-[#7A7F8E] group-hover:text-[#0C0E12] transition-colors">
                <NavIcon name={item.icon} />
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-[rgba(12,14,18,0.06)]">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-[#F7F8FA] transition-colors cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-[#F7F8FA] border border-[rgba(12,14,18,0.08)] flex items-center justify-center text-xs font-medium text-[#3A3D45] flex-shrink-0">
              {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-[#0C0E12] truncate">{session.user.name || session.user.email}</div>
            </div>
          </div>
          <Link href="/api/auth/signout" className="mt-1 flex items-center gap-2 px-3 py-2 text-xs text-[#7A7F8E] hover:text-[#0C0E12] rounded-xl hover:bg-[#F7F8FA] transition-all">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 12H3a1 1 0 01-1-1V3a1 1 0 011-1h2M9 10l3-3-3-3M12 7H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Se deconnecter
          </Link>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
