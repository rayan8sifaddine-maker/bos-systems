// BOS Systems — Types globaux
// types/index.ts

import type {
  User, Clinic, Client, Appointment, Conversation,
  Message, Subscription, Analytics, Invoice, TeamMember,
  Plan, SubscriptionStatus, AppointmentStatus,
  ClientStatus, TeamRole, AutomationType
} from '@prisma/client'

// ── RE-EXPORTS ──────────────────────────────────────
export type {
  User, Clinic, Client, Appointment, Conversation,
  Message, Subscription, Analytics, Invoice, TeamMember,
  Plan, SubscriptionStatus, AppointmentStatus,
  ClientStatus, TeamRole, AutomationType
}

// ── EXTENDED TYPES ──────────────────────────────────

export type ClinicWithSubscription = Clinic & {
  subscription: Subscription | null
}

export type ClientWithActivity = Client & {
  activities: { id: string; type: string; content: string; createdAt: Date }[]
  _count: { appointments: number; conversations: number }
}

export type AppointmentWithClient = Appointment & {
  client: Client | null
}

export type ConversationWithMessages = Conversation & {
  messages: Message[]
  client: Client | null
}

export type TeamMemberWithUser = TeamMember & {
  user: Pick<User, 'id' | 'name' | 'email' | 'image'>
}

// ── API RESPONSE TYPES ──────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ── DASHBOARD TYPES ─────────────────────────────────

export interface DashboardStats {
  totalClients: number
  clientsThisMonth: number
  clientsGrowth: number
  appointmentsToday: number
  appointmentsThisMonth: number
  confirmationRate: number
  noShowRate: number
  aiResponsesThisMonth: number
  revenue: number
  revenueGrowth: number
}

export interface WeeklyData {
  day: string
  appointments: number
  confirmations: number
}

export interface RecentActivity {
  id: string
  type: 'appointment' | 'client' | 'message' | 'automation'
  description: string
  time: Date
  metadata?: Record<string, unknown>
}

// ── FORM TYPES ──────────────────────────────────────

export interface CreateAppointmentInput {
  patientName: string
  phone?: string
  datetime: string
  type: string
  duration?: number
  notes?: string
  clientId?: string
}

export interface CreateClientInput {
  name: string
  phone?: string
  email?: string
  tags?: string[]
  notes?: string
  source?: string
}

export interface UpdateClinicInput {
  name?: string
  sector?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  hours?: string
  price?: string
  description?: string
  whatsappNumber?: string
  aiPersonality?: string
}

// ── AUTH TYPES ──────────────────────────────────────

export interface AuthUser {
  id: string
  email: string
  name: string | null
  image: string | null
  clinicId?: string
}

// ── STRIPE TYPES ────────────────────────────────────

export interface PlanConfig {
  id: Plan
  name: string
  price: number
  priceId: string
  features: string[]
  limits: {
    clients: number
    appointments: number
    teamMembers: number
    aiResponses: number
  }
}

export const PLANS: Record<Plan, PlanConfig> = {
  STARTER: {
    id: 'STARTER',
    name: 'Starter',
    price: 500,
    priceId: process.env.STRIPE_PRICE_STARTER || '',
    features: [
      'Assistant IA WhatsApp',
      'Gestion des rendez-vous',
      'Rappels automatiques',
      '200 conversations/mois',
      '1 utilisateur',
      'Support email'
    ],
    limits: { clients: 100, appointments: 200, teamMembers: 1, aiResponses: 200 }
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    price: 1500,
    priceId: process.env.STRIPE_PRICE_PRO || '',
    features: [
      'Tout ce qui est dans Starter',
      'Relances automatiques',
      'CRM complet',
      'Conversations illimitees',
      '3 utilisateurs',
      'Tableau de bord avance',
      'Support prioritaire'
    ],
    limits: { clients: 1000, appointments: -1, teamMembers: 3, aiResponses: -1 }
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    price: 5000,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || '',
    features: [
      'Tout ce qui est dans Pro',
      'Configuration sur mesure',
      'Integrations personnalisees',
      'Utilisateurs illimites',
      'Account manager dedie',
      'Formation equipe',
      'SLA garanti'
    ],
    limits: { clients: -1, appointments: -1, teamMembers: -1, aiResponses: -1 }
  }
}
