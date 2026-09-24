import { brand, nav } from '../data/site.js'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <a className="brand-mark" href="#hero">
            <span className="brand-mark__name">{brand.name}</span>
            <span className="brand-mark__sub">{brand.location}</span>
          </a>

          <div className="site-footer__social">
            <a href={brand.instagram} target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href={brand.whatsapp} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={`mailto:${brand.email}`}>E-mail</a>
          </div>
        </div>

        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} {brand.name}. Todos os direitos reservados.</span>
          <nav aria-label="Navegação do rodapé" style={{ display: 'flex', gap: 20 }}>
            {nav.slice(1).map((item) => (
              <a key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <p style={{ marginTop: 16, fontSize: 11.5, opacity: 0.55 }}>
          Modelo 3D "Violin" por{' '}
          <a href="https://sketchfab.com/Voldepreuss" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
            Voldepreuss
          </a>{' '}
          via Sketchfab, licença{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>
            CC Attribution
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
