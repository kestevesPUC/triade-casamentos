const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Simple in-memory rate limiter (per serverless instance). Good enough to
// blunt basic abuse; swap for a durable store (Upstash/Redis) if traffic grows.
const hits = new Map()
const WINDOW_MS = 60_000
const MAX_REQUESTS = 5

function isRateLimited(ip) {
  const now = Date.now()
  const entry = hits.get(ip) || { count: 0, resetAt: now + WINDOW_MS }
  if (now > entry.resetAt) {
    entry.count = 0
    entry.resetAt = now + WINDOW_MS
  }
  entry.count += 1
  hits.set(ip, entry)
  return entry.count > MAX_REQUESTS
}

function sanitize(value, max = 2000) {
  return String(value ?? '').trim().slice(0, max)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método não permitido.' })
  }

  const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown')
    .toString()
    .split(',')[0]
    .trim()

  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Muitas tentativas. Tente novamente em instantes.' })
  }

  let body = req.body
  if (!body || typeof body === 'string') {
    try {
      body = JSON.parse(body || '{}')
    } catch {
      return res.status(400).json({ error: 'Corpo da requisição inválido.' })
    }
  }

  // Honeypot: bots fill hidden fields, real users never do.
  if (sanitize(body.company)) {
    return res.status(200).json({ ok: true })
  }

  const name = sanitize(body.name, 120)
  const email = sanitize(body.email, 160)
  const phone = sanitize(body.phone, 40)
  const weddingDate = sanitize(body.weddingDate, 40)
  const message = sanitize(body.message, 2000)

  const errors = {}
  if (!name) errors.name = 'Informe o nome.'
  if (!email || !EMAIL_RE.test(email)) errors.email = 'E-mail inválido.'
  if (!message) errors.message = 'Mensagem obrigatória.'

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ error: 'Dados inválidos.', fields: errors })
  }

  const submission = {
    name,
    email,
    phone,
    weddingDate,
    message,
    receivedAt: new Date().toISOString(),
    ip,
  }

  try {
    await deliverSubmission(submission)
  } catch (err) {
    console.error('Falha ao processar contato:', err)
    return res.status(502).json({ error: 'Não foi possível enviar sua mensagem agora. Tente novamente ou use o WhatsApp.' })
  }

  return res.status(200).json({ ok: true })
}

// Sends the lead via SMTP when credentials are configured (SMTP_HOST, SMTP_PORT,
// SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL). Falls back to logging so local/dev
// environments and first deploys don't hard-fail before SMTP is set up.
async function deliverSubmission(submission) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL } = process.env

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
    console.info('[contact] SMTP não configurado — novo lead registrado:', submission)
    return
  }

  const nodemailer = await import('nodemailer')
  const transporter = nodemailer.default.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  await transporter.sendMail({
    from: `"Site Triade Casamentos" <${SMTP_USER}>`,
    to: CONTACT_TO_EMAIL,
    replyTo: submission.email,
    subject: `Novo contato pelo site — ${submission.name}`,
    text: [
      `Nome: ${submission.name}`,
      `E-mail: ${submission.email}`,
      `Telefone: ${submission.phone || '-'}`,
      `Data do casamento: ${submission.weddingDate || '-'}`,
      '',
      submission.message,
    ].join('\n'),
  })
}
