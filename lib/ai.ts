// lib/ai.ts
import Anthropic from '@anthropic-ai/sdk'
import { prisma } from './prisma'
import type { Clinic } from '@prisma/client'

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

// ── BUILD SYSTEM PROMPT ──────────────────────────────
function buildSystemPrompt(clinic: Clinic): string {
  return `Tu es l'assistant IA de ${clinic.name} a ${clinic.city}, Maroc.
Tu reponds aux clients via WhatsApp. Sois professionnel, chaleureux et concis (max 4 lignes).
Reponds TOUJOURS en francais.

Informations de la clinique :
- Nom : ${clinic.name}
- Secteur : ${clinic.sector}
- Horaires : ${clinic.hours}
- Tarif consultation : ${clinic.price}
- Telephone : ${clinic.phone || 'Non renseigne'}
- Adresse : ${clinic.address || clinic.city}
${clinic.aiPersonality ? `\nPersonnalite : ${clinic.aiPersonality}` : ''}

Instructions :
- Si le client veut un RDV, demande ses disponibilites et confirme
- Si le client pose une question hors de ta portee, donne le numero de telephone
- Ne fournis jamais d'informations medicales specifiques
- Sois toujours poli et professionnel
- Une seule question a la fois maximum`
}

// ── GENERATE AI RESPONSE ─────────────────────────────
export async function generateAIResponse(
  clinicId: string,
  conversationId: string,
  userMessage: string
): Promise<string> {
  const clinic = await prisma.clinic.findUnique({ where: { id: clinicId } })
  if (!clinic) throw new Error('Clinic not found')

  // Load conversation history (last 10 messages)
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    take: 10,
  })

  const history = messages.map((m) => ({
    role: m.role === 'USER' ? ('user' as const) : ('assistant' as const),
    content: m.content,
  }))

  // Add current message
  history.push({ role: 'user', content: userMessage })

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    system: buildSystemPrompt(clinic),
    messages: history,
  })

  const aiText = response.content[0].type === 'text' ? response.content[0].text : ''

  // Update analytics
  await prisma.analytics.upsert({
    where: {
      clinicId_date: {
        clinicId,
        date: new Date(new Date().setHours(0, 0, 0, 0)),
      },
    },
    create: {
      clinicId,
      date: new Date(new Date().setHours(0, 0, 0, 0)),
      aiResponses: 1,
    },
    update: { aiResponses: { increment: 1 } },
  })

  return aiText
}

// ── DETECT HOT LEAD ──────────────────────────────────
export async function detectHotLead(conversationText: string): Promise<boolean> {
  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 50,
    messages: [{
      role: 'user',
      content: `Analyse cette conversation. Est-ce que le client montre une intention claire de prendre un RDV ou d'acheter un service ? Reponds uniquement par "oui" ou "non".\n\n${conversationText}`
    }]
  })

  const text = response.content[0].type === 'text' ? response.content[0].text.toLowerCase() : ''
  return text.includes('oui')
}

// ── GENERATE FOLLOWUP MESSAGE ────────────────────────
export async function generateFollowup(clinic: Clinic, clientName: string, context: string): Promise<string> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: `Tu es l'assistant de ${clinic.name}. Redige un message de relance court et professionnel pour ${clientName}. Contexte : ${context}. Maximum 3 lignes. En francais.`
    }]
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

// ── SUMMARIZE CONVERSATION ───────────────────────────
export async function summarizeConversation(messages: { role: string; content: string }[]): Promise<string> {
  const text = messages.map((m) => `${m.role}: ${m.content}`).join('\n')

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    messages: [{
      role: 'user',
      content: `Resumes cette conversation en 2-3 lignes max, en francais :\n\n${text}`
    }]
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}
