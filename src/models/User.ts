import { type InferSchemaType, type Model, Schema, model, models } from 'mongoose'

export type Provider = 'google' | 'kakao' | 'naver' | 'local'

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true }, // 로그인 이메일
    password: { type: String, default: null }, // 로컬 가입시 bcrypt 해시, 소셜은 null
    tempPwdYn: { type: String, enum: ['Y', 'N'], default: 'N' }, // 임시 비번 발급 상태
    name: { type: String, required: true }, // 닉네임 (화면 표시용)
    handle: { type: String, required: true, unique: true }, // URL용 handle
    profileImage: { type: String, default: '' }, // 프로필 이미지 URL
    provider: { type: String, enum: ['google', 'kakao', 'naver', 'local'], required: true }, // 가입 경로
  },
  { timestamps: true },
)

export type User = InferSchemaType<typeof userSchema>

const User = (models.User as Model<User>) || model<User>('User', userSchema)

export default User
