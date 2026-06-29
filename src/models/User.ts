import { type InferSchemaType, type Model, Schema, model, models } from 'mongoose'

export type Provider = 'google' | 'kakao' | 'naver' | 'local'

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true }, // 로그인 이메일
    password: { type: String, default: null }, // 로컬 가입은 bcrypt 해시고 소셜은 null
    resetCode: { type: String, default: null }, // 비번 재설정 인증코드 (bcrypt 해시)
    resetCodeExpiresAt: { type: Date, default: null }, // 인증코드 만료 시각
    resetCodeAttempts: { type: Number, default: 0 }, // 인증코드 검증 실패 횟수 (brute-force 방지)
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
