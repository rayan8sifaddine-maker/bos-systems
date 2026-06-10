// lib/stripe.ts
import Stripe from 'stripe'
import { prisma } from './prisma'
import { PLANS } from '@/types'
import type { Plan } from '@prisma/client'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

// ── CREATE CUSTOMER ──────────────────────────────────
export async function createStripeCustomer(clinicId: string, email: string, name: string) {
  const customer = await stripe.customers.create({ email, name, metadata: { clinicId } })

  await prisma.subscription.upsert({
    where: { clinicId },
    create: {
      clinicId,
      stripeCustomerId: customer.id,
      plan: 'STARTER',
      status: 'TRIALING',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    },
    update: { stripeCustomerId: customer.id },
  })

  return customer
}

// ── CREATE CHECKOUT SESSION ──────────────────────────
export async function createCheckoutSession(clinicId: string, plan: Plan, successUrl: string, cancelUrl: string) {
  const subscription = await prisma.subscription.findUnique({ where: { clinicId } })
  if (!subscription?.stripeCustomerId) throw new Error('No Stripe customer')

  const planConfig = PLANS[plan]

  const session = await stripe.checkout.sessions.create({
    customer: subscription.stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { clinicId, plan },
    subscription_data: {
      trial_period_days: 14,
      metadata: { clinicId, plan },
    },
  })

  return session
}

// ── CREATE PORTAL SESSION ────────────────────────────
export async function createPortalSession(clinicId: string, returnUrl: string) {
  const subscription = await prisma.subscription.findUnique({ where: { clinicId } })
  if (!subscription?.stripeCustomerId) throw new Error('No Stripe customer')

  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripeCustomerId,
    return_url: returnUrl,
  })

  return session
}

// ── HANDLE WEBHOOK ───────────────────────────────────
export async function handleStripeWebhook(body: string, signature: string) {
  const event = stripe.webhooks.constructEvent(
    body,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const clinicId = sub.metadata.clinicId
      const plan = (sub.metadata.plan as Plan) || 'STARTER'

      await prisma.subscription.update({
        where: { clinicId },
        data: {
          stripeSubscriptionId: sub.id,
          stripePriceId: sub.items.data[0]?.price.id,
          plan,
          status: mapStripeStatus(sub.status),
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
        },
      })
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const clinicId = sub.metadata.clinicId

      await prisma.subscription.update({
        where: { clinicId },
        data: { status: 'CANCELED' },
      })
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      const customerId = invoice.customer as string

      const subscription = await prisma.subscription.findUnique({
        where: { stripeCustomerId: customerId },
      })

      if (subscription) {
        await prisma.invoice.create({
          data: {
            clinicId: subscription.clinicId,
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_paid,
            currency: 'MAD',
            status: 'paid',
            pdfUrl: invoice.invoice_pdf,
            periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
            periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
          },
        })
      }
      break
    }
  }

  return event
}

function mapStripeStatus(status: Stripe.Subscription.Status) {
  const map: Record<string, 'TRIALING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'UNPAID'> = {
    trialing: 'TRIALING',
    active: 'ACTIVE',
    past_due: 'PAST_DUE',
    canceled: 'CANCELED',
    unpaid: 'UNPAID',
    incomplete: 'PAST_DUE',
    incomplete_expired: 'CANCELED',
  }
  return map[status] || 'ACTIVE'
}
