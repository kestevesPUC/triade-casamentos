import { testimonials } from '../data/site.js'

export default function Testimonials() {
  return (
    <section id="depoimentos" className="section testimonials">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Depoimentos</span>
          <h2 style={{ marginTop: 18 }}>O que os noivos dizem</h2>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t) => (
            <div className="testimonial-card" key={t.author}>
              <span className="testimonial-card__mark" aria-hidden="true">
                "
              </span>
              <p className="quote">{t.quote}</p>
              <div className="testimonial-card__author">
                <strong>{t.author}</strong>
                <span>{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
