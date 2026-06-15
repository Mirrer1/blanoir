import { customAlphabet } from 'nanoid'

// 비밀번호 재설정용 6자리 숫자 인증코드
const sixDigits = customAlphabet('0123456789', 6)

export const generateResetCode = () => sixDigits()
