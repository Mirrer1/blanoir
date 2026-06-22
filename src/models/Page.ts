import { type InferSchemaType, type Model, Schema, model, models } from 'mongoose'

const sectionSchema = new Schema(
  {
    id: { type: String, required: true }, // 섹션 고유 ID
    type: { type: String, required: true }, // title | paragraph | image | button | divider | gallery | card
    content: { type: Schema.Types.Mixed, default: {} }, // 타입별 콘텐츠
    style: { type: Schema.Types.Mixed, default: {} }, // 타입별 스타일
    container: { type: Schema.Types.Mixed }, // 박스(배경색 | 배경이미지 |높이)
  },
  { _id: false },
)

const pageSchema = new Schema(
  {
    pageId: { type: String, required: true, unique: true }, // nanoid 10자 (URL용)
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // 작성자
    title: { type: String, default: '' }, // 페이지 제목
    sections: { type: [sectionSchema], default: [] }, // 섹션 데이터 배열
    isPublic: { type: Boolean, default: false }, // 공개 여부 (기본 비공개)
  },
  { timestamps: true },
)

export type Page = InferSchemaType<typeof pageSchema>

const Page = (models.Page as Model<Page>) || model<Page>('Page', pageSchema)

export default Page
