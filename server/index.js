import express from 'express'
import contactHandler from '../api/contact.js'

const app = express()
app.use(express.json())

// Reuses the exact same handler that runs as a Vercel serverless function,
// so local dev behavior matches production.
app.post('/api/contact', (req, res) => contactHandler(req, res))

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Triade Casamentos API rodando em http://localhost:${port}`)
})
