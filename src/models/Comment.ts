import { type InferSchemaType, type Model, Schema, model, models } from 'mongoose'

// 둘러보기 페이지 댓글
const commentSchema = new Schema(
  {
    pageId: { type: String, required: true }, // 대상 공유 페이지
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // 작성자
    text: { type: String, required: true }, // 본문
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null }, // 대댓글이면 최상위 댓글 id
    deleted: { type: Boolean, default: false }, // 남의 답글 보존용 tombstone 여부
  },
  { timestamps: true },
)

commentSchema.index({ pageId: 1, createdAt: 1 })

export type Comment = InferSchemaType<typeof commentSchema>

const Comment = (models.Comment as Model<Comment>) || model<Comment>('Comment', commentSchema)

export default Comment
