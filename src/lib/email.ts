import nodemailer from 'nodemailer'

const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env

// Gmail이 설정되어 있으면 SMTP로 발송하고 그렇지 않으면 콘솔에 출력
const transporter =
  GMAIL_USER && GMAIL_APP_PASSWORD
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
      })
    : null

// 인증코드 메일 공통 발송
async function sendCodeEmail(
  to: string,
  code: string,
  label: string,
  subject: string,
  title: string,
  description: string,
) {
  if (!transporter) {
    console.log(`[${label}] ${to} 인증코드: ${code}`)
    return
  }

  await transporter.sendMail({
    from: `Blanoir <${GMAIL_USER}>`,
    to,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h1 style="font-size: 20px; font-weight: 800;">${title}</h1>
        <p style="color: #52525b;">${description}</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; margin: 24px 0;">${code}</p>
        <p style="color: #a1a1aa; font-size: 13px;">본인이 요청하지 않았다면 이 메일을 무시하세요.</p>
      </div>
    `,
  })
}

export const sendResetCodeEmail = (to: string, code: string) =>
  sendCodeEmail(
    to,
    code,
    '비밀번호 재설정',
    'Blanoir 비밀번호 재설정 인증코드',
    '비밀번호 재설정',
    '아래 인증코드를 입력해 비밀번호를 재설정해 주세요. 코드는 10분간 유효합니다.',
  )

export const sendSignupCodeEmail = (to: string, code: string) =>
  sendCodeEmail(
    to,
    code,
    '회원가입 인증',
    'Blanoir 회원가입 인증코드',
    '이메일 인증',
    '아래 인증코드를 입력해 회원가입을 완료해 주세요. 코드는 10분간 유효합니다.',
  )
