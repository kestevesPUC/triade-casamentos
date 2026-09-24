import { useState } from 'react'
import { brand } from '../data/site.js'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  weddingDate: '',
  message: '',
  company: '', // honeypot field
}

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Informe seu nome.'
  if (!form.email.trim()) {
    errors.email = 'Informe seu e-mail.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'E-mail inválido.'
  }
  if (!form.message.trim()) errors.message = 'Conte um pouco sobre o seu casamento.'
  return errors
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.company) return // bot caught by honeypot

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('sending')
    setStatusMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || 'Não foi possível enviar sua mensagem.')
      }

      setStatus('success')
      setStatusMessage('Mensagem enviada! Em breve entraremos em contato.')
      setForm(initialForm)
    } catch (err) {
      setStatus('error')
      setStatusMessage(err.message || 'Algo deu errado. Tente novamente ou fale pelo WhatsApp.')
    }
  }

  return (
    <section id="contato" className="section contact">
      <div className="container contact__grid">
        <div className="contact__info">
          <span className="eyebrow">Contato</span>
          <h2 style={{ marginTop: 18 }}>Vamos falar sobre o seu casamento?</h2>
          <p style={{ marginTop: 20 }}>
            Conte para a gente a data, o local e o clima que vocês imaginam — respondemos rápido
            para garantir a disponibilidade do trio.
          </p>

          <ul className="contact__list">
            <li>
              <span>WhatsApp</span>
              <a href={brand.whatsapp} target="_blank" rel="noreferrer">
                {brand.whatsappDisplay}
              </a>
            </li>
            <li>
              <span>E-mail</span>
              <a href={`mailto:${brand.email}`}>{brand.email}</a>
            </li>
            <li>
              <span>Instagram</span>
              <a href={brand.instagram} target="_blank" rel="noreferrer">
                {brand.instagramHandle}
              </a>
            </li>
            <li>
              <span>Atuação</span>
              <strong>{brand.location}</strong>
            </li>
          </ul>
        </div>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="company">Empresa</label>
            <input
              id="company"
              name="company"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={handleChange('company')}
            />
          </div>

          <div className="contact-form__row">
            <div className="field">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={form.name}
                onChange={handleChange('name')}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? 'name-error' : undefined}
              />
              {errors.name && <span id="name-error" className="field-error">{errors.name}</span>}
            </div>

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                placeholder="voce@email.com"
                value={form.email}
                onChange={handleChange('email')}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <span id="email-error" className="field-error">{errors.email}</span>}
            </div>
          </div>

          <div className="contact-form__row">
            <div className="field">
              <label htmlFor="phone">Telefone / WhatsApp</label>
              <input
                id="phone"
                type="tel"
                placeholder="(31) 90000-0000"
                value={form.phone}
                onChange={handleChange('phone')}
              />
            </div>

            <div className="field">
              <label htmlFor="weddingDate">Data do casamento</label>
              <input
                id="weddingDate"
                type="date"
                value={form.weddingDate}
                onChange={handleChange('weddingDate')}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="message">Mensagem</label>
            <textarea
              id="message"
              rows={4}
              placeholder="Conte sobre o local, horário e estilo do casamento"
              value={form.message}
              onChange={handleChange('message')}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && <span id="message-error" className="field-error">{errors.message}</span>}
          </div>

          <button type="submit" className="btn btn--gold" disabled={status === 'sending'} style={{ width: '100%' }}>
            {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
          </button>

          {status === 'success' && <p className="form-status form-status--success">{statusMessage}</p>}
          {status === 'error' && <p className="form-status form-status--error">{statusMessage}</p>}
        </form>
      </div>
    </section>
  )
}
