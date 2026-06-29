import { customAlphabet } from 'nanoid'

// 6자리 숫자 인증코드
const sixDigits = customAlphabet('0123456789', 6)

export const generateCode = () => sixDigits()
