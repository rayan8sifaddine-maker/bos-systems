// app/dashboard/page.tsx
import { requireAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { formatCurrency, formatDate, formatTime, calculateGrowth, STATUS_COLORS, STATUS_LABELS } from '@/lib/utils'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Tableau de bord' }

export default async function DashboardPage() {
  const session = await requireAuth().catch(() => null)
  if (!session) redirect('/connexion')

  const clinic = await prisma.clinic.findFirst({
    where: { userId: session.user.id },
    include: { subscription: true },
  })
  if (!clinic) redirect('/inscription')

  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0))
  const todayEnd = new Date(now.setHours(23, 59, 59, 999))
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalClients,
    clientsThisMonth,
    clientsLastMonth,
    appointmentsToday,
    appointmentsThisMonth,
    appointmentsLastMonth,
    confirmedThisMonth,
    noShowThisMonth,
    aiResponsesThisMonth,
    recentAppointments,
    recentActivities,
    weeklyData,
  ] = await Promise.all([
    prisma.client.count({ where: { clinicId: clinic.id } }),
    prisma.client.count({ where: { clinicId: clinic.id, createdAt: { gte: monthStart } } }),
    prisma.client.count({ where: { clinicId: clinic.id, createdAt: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    prisma.appointment.count({ where: { clinicId: clinic.id, datetime: { gte: todayStart, lte: todayEnd } } }),
    prisma.appointment.count({ where: { clinicId: clinic.id, datetime: { gte: monthStart } } }),
    prisma.appointment.count({ where: { clinicId: clinic.id, datetime: { gte: lastMonthStart, lte: lastMonthEnd } } }),
    prisma.appointment.count({ where: { clinicId: clinic.id, datetime: { gte: monthStart }, status: 'CONFIRMED' } }),
    prisma.appointment.count({ where: { clinicId: clinic.id, datetime: { gte: monthStart }, status: 'NO_SHOW' } }),
    prisma.analytics.aggregate({ where: { clinicId: clinic.id, date: { gte: monthStart } }, _sum: { aiResponses: true } }),
    prisma.appointment.findMany({
      where: { clinicId: clinic.id, datetime: { gte: todayStart, lte: todayEnd } },
      include: { client: true },
      orderBy: { datetime: 'asc' },
      take: 8,
    }),
    prisma.appointment.findMany({
      where: { clinicId: clinic.id },
      orderBy: { createdAt: 'desc' },
      take: 6,
      include: { client: true },
    }),
    // Weekly appointments for chart
    prisma.$queryRaw`
      SELECT DATE_TRUNC('day', datetime) as day, COUNT(*) as count
      FROM "Appointment"
      WHERE "clinicId" = ${clinic.id}
        AND datetime >= NOW() - INTERVAL '7 days'
      GROUP BY DATE_TRUNC('day', datetime)
      ORDER BY day ASC
    ` as Promise<{ day: Date; count: bigint }[]>,
  ])

  const confirmRate = appointmentsThisMonth > 0 ? Math.round((confirmedThisMonth / appointmentsThisMonth) * 100) : 0
  const noShowRate = appointmentsThisMonth > 0 ? Math.round((noShowThisMonth / appointmentsThisMonth) * 100) : 0
  const clientsGrowth = calculateGrowth(clientsThisMonth, clientsLastMonth)
  const appointmentsGrowth = calculateGrowth(appointmentsThisMonth, appointmentsLastMonth)

  const STATS = [
    {
      label: 'Total clients',
      value: totalClients.toString(),
      sub: clientsGrowth >= 0 ? `+${clientsGrowth}% ce mois` : `${clientsGrowth}% ce mois`,
      positive: clientsGrowth >= 0,
    },
    {
      label: 'RDV aujourd\'hui',
      value: appointmentsToday.toString(),
      sub: `${appointmentsThisMonth} ce mois`,
      positive: true,
    },
    {
      label: 'Taux confirmation',
      value: `${confirmRate}%`,
      sub: `Absent : ${noShowRate}%`,
      positive: confirmRate >= 70,
    },
    {
      label: 'Reponses IA',
      value: (aiResponsesThisMonth._sum.aiResponses || 0).toString(),
      sub: 'ce mois, sans effort',
      positive: true,
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0C0E12]">Tableau de bord</h1>
          <p className="text-sm text-[#7A7F8E] mt-1">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${clinic.subscription?.status === 'TRIALING' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
            {clinic.subscription?.status === 'TRIALING' ? 'Essai gratuit' : 'Actif'}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {STATS.map((s) => (
          <div key={s.label} className="bg-white border border-[rgba(12,14,18,0.06)] rounded-2xl p-5">
            <div className="text-xs font-medium text-[#7A7F8E] uppercase tracking-wider mb-3">{s.label}</div>
            <div className="text-3xl font-bold tracking-tight text-[#0C0E12] mb-1">{s.value}</div>
            <div className={`text-xs ${s.positive ? 'text-emerald-600' : 'text-red-500'}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-[1fr_320px] gap-6">

        {/* Left */}
        <div className="space-y-6">

          {/* Today's appointments */}
          <div className="bg-white border border-[rgba(12,14,18,0.06)] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-[#0C0E12]">Rendez-vous du jour</h2>
              <a href="/dashboard/rendez-vous" className="text-xs text-[#1A56FF] hover:underline">Voir tout →</a>
            </div>

            {recentAppointments.length === 0 ? (
              <div className="text-center py-10 text-sm text-[#B0B5C3]">
                Aucun rendez-vous aujourd'hui
              </div>
            ) : (
              <div className="space-y-2">
                {recentAppointments.map((appt) => (
                  <div key={appt.id} className="flex items-center gap-4 p-3 rounded-xl border border-[rgba(12,14,18,0.06)] hover:bg-[#F7F8FA] transition-colors">
                    <div className="text-sm font-semibold text-[#0C0E12] w-12 flex-shrink-0">{formatTime(appt.datetime)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#0C0E12] truncate">{appt.patientName}</div>
                      <div className="text-xs text-[#7A7F8E]">{appt.type}</div>
                    </div>
                    <span className={`badge text-[10px] ${STATUS_COLORS[appt.status]}`}>
                      {STATUS_LABELS[appt.status]}
                    </span>
                    {appt.source === 'WHATSAPP_AI' && (
                      <span className="badge badge-info text-[10px] bg-[#EEF2FF] text-[#1A56FF] border-[rgba(26,86,255,0.2)]">Via IA</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Nouveau RDV', href: '/dashboard/rendez-vous/nouveau', icon: '📅' },
              { label: 'Nouveau client', href: '/dashboard/crm/nouveau', icon: '👤' },
              { label: 'Voir conversations', href: '/dashboard/whatsapp', icon: '💬' },
            ].map((action) => (
              <a
                key={action.label}
                href={action.href}
                className="bg-white border border-[rgba(12,14,18,0.06)] rounded-2xl p-4 hover:bg-[#F7F8FA] hover:border-[rgba(12,14,18,0.12)] transition-all text-center"
              >
                <div className="text-2xl mb-2">{action.icon}</div>
                <div className="text-sm font-medium text-[#0C0E12]">{action.label}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">

          {/* Recent activity */}
          <div className="bg-white border border-[rgba(12,14,18,0.06)] rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-[#0C0E12] mb-4">Activite recente</h2>
            {recentActivities.length === 0 ? (
              <div className="text-center py-6 text-sm text-[#B0B5C3]">Aucune activite</div>
            ) : (
              <div className="space-y-0 divide-y divide-[rgba(12,14,18,0.04)]">
                {recentActivities.map((appt) => (
                  <div key={appt.id} className="flex items-start gap-3 py-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${appt.source === 'WHATSAPP_AI' ? 'bg-[#1A56FF]' : 'bg-emerald-500'}`} />
                    <div className="min-w-0">
                      <div className="text-xs text-[#3A3D45] leading-relaxed">
                        RDV {appt.patientName} — {appt.type}
                      </div>
                      <div className="text-[10px] text-[#B0B5C3] mt-0.5">{formatDate(appt.datetime)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trial notice */}
          {clinic.subscription?.status === 'TRIALING' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="text-sm font-semibold text-amber-800 mb-1">Essai gratuit en cours</div>
              <div className="text-xs text-amber-700 mb-3">
                Votre essai se termine le{' '}
                {clinic.subscription.trialEndsAt?.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              </div>
              <a href="/dashboard/facturation" className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 hover:underline">
                Voir les plans →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
