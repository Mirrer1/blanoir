'use server'

import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Page from '@/models/Page'

type CreatePageResult = { ok: true; pageId: string } | { ok: false; message: string }

export async function createPage(): Promise<CreatePageResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false, message: '로그인이 필요해요' }
  }

  await connectDB()

  const pageId = nanoid(10)
  await Page.create({ pageId, userId: session.user.id, title: '', sections: [], isPublic: false })

  revalidatePath('/dashboard')

  return { ok: true, pageId }
}
