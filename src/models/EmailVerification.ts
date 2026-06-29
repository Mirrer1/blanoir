import { type InferSchemaType, type Model, Schema, model, models } from 'mongoose'

// 회원가입 전 이메일 소유 확인 상태
const emailVerificationSchema = new Schema(
  {
    email: { type: String, required: true, unique: true }, // 인증 대상 이메일
    code: { type: String, required: true }, // 인증코드 bcrypt 해시
    expiresAt: { type: Date, required: true }, // 코드 만료 시각
    attempts: { type: Number, default: 0 }, // 검증 실패 횟수
    verified: { type: Boolean, default: false }, // 코드 확인 완료 여부
  },
  { timestamps: true },
)

export type EmailVerification = InferSchemaType<typeof emailVerificationSchema>

const EmailVerification =
  (models.EmailVerification as Model<EmailVerification>) ||
  model<EmailVerification>('EmailVerification', emailVerificationSchema)

export default EmailVerification
