'use server'

import { revalidatePath } from 'next/cache'

import { auth } from '@/lib/auth'
import { connectDB } from '@/lib/mongoDB'
import Comment from '@/models/Comment'
import Page from '@/models/Page'
import {
  type CommentEditInput,
  type CommentInput,
  commentEditSchema,
  commentSchema,
} from '@/types/explore'

const UNEXPECTED_ERROR = '잠시 후 다시 시도해 주세요'

type CommentResult = { ok: true } | { ok: false; message: string }

export async function createComment(input: CommentInput): Promise<CommentResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    const parsed = commentSchema.safeParse(input)
    if (!parsed.success) {
      return { ok: false, message: '댓글을 입력해 주세요' }
    }
    const { pageId, text, parentId } = parsed.data

    await connectDB()

    // 공유된 페이지에만 댓글 허용
    const page = await Page.exists({ pageId, sharedToCommunity: true })
    if (!page) {
      return { ok: false, message: '댓글을 달 수 없는 페이지예요' }
    }

    // 대댓글은 같은 페이지의 최상위 댓글에만 허용
    if (parentId) {
      const parent = await Comment.findById(parentId).lean<{
        pageId: string
        parentId: unknown
        deleted: boolean
      } | null>()
      if (!parent || parent.pageId !== pageId || parent.parentId || parent.deleted) {
        return { ok: false, message: '답글을 달 수 없어요' }
      }
    }

    await Comment.create({ pageId, userId: session.user.id, text, parentId: parentId ?? null })
    await Page.updateOne({ pageId }, { $inc: { commentCount: 1 } })

    revalidatePath(`/explore/${pageId}`)
    revalidatePath('/explore')

    return { ok: true }
  } catch (error) {
    console.error('createComment failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

export async function updateComment(input: CommentEditInput): Promise<CommentResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    const parsed = commentEditSchema.safeParse(input)
    if (!parsed.success) {
      return { ok: false, message: '댓글을 입력해 주세요' }
    }
    const { commentId, text } = parsed.data

    await connectDB()

    const comment = await Comment.findById(commentId).lean<{
      pageId: string
      deleted: boolean
      userId: { toString(): string }
    } | null>()
    if (!comment || comment.deleted) {
      return { ok: false, message: '이미 삭제된 댓글이에요' }
    }
    if (comment.userId.toString() !== session.user.id) {
      return { ok: false, message: '권한이 없어요' }
    }

    await Comment.updateOne({ _id: commentId }, { $set: { text } })

    revalidatePath(`/explore/${comment.pageId}`)

    return { ok: true }
  } catch (error) {
    console.error('updateComment failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}

export async function deleteComment(commentId: string): Promise<CommentResult> {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { ok: false, message: '로그인이 필요해요' }
    }

    await connectDB()

    const userId = session.user.id
    const comment = await Comment.findById(commentId).lean<{
      pageId: string
      parentId: unknown
      deleted: boolean
      userId: { toString(): string }
    } | null>()
    if (!comment || comment.deleted) {
      return { ok: false, message: '이미 삭제된 댓글이에요' }
    }
    if (comment.userId.toString() !== userId) {
      return { ok: false, message: '권한이 없어요' }
    }

    // 대댓글은 하드삭제하고 부모가 빈 tombstone이면 함께 정리
    if (comment.parentId) {
      await Comment.deleteOne({ _id: commentId })
      await Page.updateOne({ pageId: comment.pageId }, { $inc: { commentCount: -1 } })

      const remaining = await Comment.countDocuments({ parentId: comment.parentId })
      if (remaining === 0) {
        await Comment.deleteOne({ _id: comment.parentId, deleted: true })
      }
    } else if (await Comment.exists({ parentId: commentId, userId: { $ne: userId } })) {
      // 남의 답글이 있으면 본문만 삭제 표시하고 답글은 보존
      await Comment.updateOne({ _id: commentId }, { $set: { deleted: true, text: '' } })
      await Page.updateOne({ pageId: comment.pageId }, { $inc: { commentCount: -1 } })
    } else {
      // 내 답글만 있거나 없으면 댓글과 답글을 모두 하드삭제
      const replies = await Comment.deleteMany({ parentId: commentId })
      await Comment.deleteOne({ _id: commentId })
      await Page.updateOne(
        { pageId: comment.pageId },
        { $inc: { commentCount: -(1 + replies.deletedCount) } },
      )
    }

    revalidatePath(`/explore/${comment.pageId}`)
    revalidatePath('/explore')

    return { ok: true }
  } catch (error) {
    console.error('deleteComment failed', error)
    return { ok: false, message: UNEXPECTED_ERROR }
  }
}
