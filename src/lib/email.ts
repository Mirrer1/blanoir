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

export async function sendResetCodeEmail(to: string, code: string) {
  if (!transporter) {
    console.log(`[비밀번호 재설정] ${to} 인증코드: ${code}`)
    return
  }

  await transporter.sendMail({
    from: `Blanoir <${GMAIL_USER}>`,
    to,
    subject: 'Blanoir 비밀번호 재설정 인증코드',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h1 style="font-size: 20px; font-weight: 800;">비밀번호 재설정</h1>
        <p style="color: #52525b;">아래 인증코드를 입력해 비밀번호를 재설정해 주세요. 코드는 10분간 유효합니다.</p>
        <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; margin: 24px 0;">${code}</p>
        <p style="color: #a1a1aa; font-size: 13px;">본인이 요청하지 않았다면 이 메일을 무시하세요.</p>
      </div>
    `,
  })
}
