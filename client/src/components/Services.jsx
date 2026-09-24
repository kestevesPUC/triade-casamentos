import { services } from '../data/site.js'

export default function Services() {
  return (
    <section id="servicos" className="section services">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">O que oferecemos</span>
          <h2 style={{ marginTop: 18 }}>Cada etapa da celebração, com a trilha certa</h2>
          <p>Do silêncio da cerimônia à energia da pista, montamos o repertório ideal para cada momento do seu casamento.</p>
        </div>
      </div>

      <div className="container">
        <div className="services-grid">
          {services.map((service, i) => (
            <div className="service-card" key={service.title}>
              <span className="service-card__index">{String(i + 1).padStart(2, '0')}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
