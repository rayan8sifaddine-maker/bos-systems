// app/api/auth/register/route.ts
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  clinicName: z.string().min(2, 'Nom trop court').max(100),
  sector: z.string().min(1),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court'),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { clinicName, sector, email, password } = parsed.data

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'Email deja utilise.' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user + clinic + subscription in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, hashedPassword, name: clinicName },
      })

      const clinic = await tx.clinic.create({
        data: {
          userId: user.id,
          name: clinicName,
          sector,
        },
      })

      await tx.subscription.create({
        data: {
          clinicId: clinic.id,
          plan: 'STARTER',
          status: 'TRIALING',
          trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      })

      await tx.teamMember.create({
        data: { clinicId: clinic.id, userId: user.id, role: 'OWNER' },
      })

      return { user, clinic }
    })

    return NextResponse.json(
      { message: 'Compte cree avec succes', userId: result.user.id },
      { status: 201 }
    )
  } catch (err) {
    console.error('[REGISTER]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
