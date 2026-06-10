// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, isToday, isTomorrow } from 'date-fns'
import { fr } from 'date-fns/locale'

// ── TAILWIND MERGE ────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── DATE FORMATTERS ───────────────────────────────────
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  if (isToday(d)) return `Aujourd'hui ${format(d, 'HH:mm')}`
  if (isTomorrow(d)) return `Demain ${format(d, 'HH:mm')}`
  return format(d, 'dd MMM yyyy HH:mm', { locale: fr })
}

export function formatDateShort(date: Date | string): string {
  return format(new Date(date), 'dd MMM', { locale: fr })
}

export function formatTime(date: Date | string): string {
  return format(new Date(date), 'HH:mm')
}

export function timeAgo(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr })
}

// ── NUMBER FORMATTERS ─────────────────────────────────
export function formatCurrency(amount: number, currency = 'MAD'): string {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' })
    .format(amount / 100)
    .replace('MAD', 'DH')
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('fr-FR').format(n)
}

export function formatPercent(n: number): string {
  return `${Math.round(n)}%`
}

// ── STRING HELPERS ────────────────────────────────────
export function initials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// ── PHONE HELPERS ─────────────────────────────────────
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.startsWith('212')) return `+${cleaned}`
  if (cleaned.startsWith('0')) return `+212${cleaned.slice(1)}`
  return `+212${cleaned}`
}

export function isValidMarocPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return /^(212|0)(5|6|7)\d{8}$/.test(cleaned)
}

// ── GROWTH CALCULATION ────────────────────────────────
export function calculateGrowth(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

// ── API HELPERS ───────────────────────────────────────
export function buildApiUrl(path: string, params?: Record<string, string>): string {
  const url = new URL(path, process.env.NEXT_PUBLIC_APP_URL)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  }
  return url.toString()
}

export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Request failed')
  }
  return res.json()
}

// ── COLORS BY STATUS ──────────────────────────────────
export const STATUS_COLORS = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELED: 'bg-red-50 text-red-700 border-red-200',
  DONE: 'bg-blue-50 text-blue-700 border-blue-200',
  NO_SHOW: 'bg-gray-50 text-gray-600 border-gray-200',
  LEAD: 'bg-purple-50 text-purple-700 border-purple-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  INACTIVE: 'bg-gray-50 text-gray-600 border-gray-200',
  LOST: 'bg-red-50 text-red-700 border-red-200',
} as const

export const STATUS_LABELS: Record<string, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirme',
  CANCELED: 'Annule',
  DONE: 'Termine',
  NO_SHOW: 'Absent',
  LEAD: 'Prospect',
  ACTIVE: 'Actif',
  INACTIVE: 'Inactif',
  LOST: 'Perdu',
  TRIALING: 'Essai gratuit',
  PAST_DUE: 'Paiement en retard',
}
