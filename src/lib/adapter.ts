// src/lib/adapter.ts
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'

export const adapter = PrismaAdapter(prisma)
