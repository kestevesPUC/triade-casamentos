import { brand, gallery } from '../data/site.js'

export default function Gallery() {
  return (
    <section id="galeria" className="section gallery">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Galeria</span>
          <h2 style={{ marginTop: 18 }}>Momentos capturados ao vivo</h2>
          <p>Fotos reais de cerimônias e recepções. Confira ainda mais no nosso Instagram.</p>
        </div>

        <div className="gallery-grid">
          {gallery.map((item) => (
            <a key={item.src} href={brand.instagram} target="_blank" rel="noreferrer">
              <img
                src={item.src}
                alt={item.alt}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </a>
          ))}
        </div>

        <div className="gallery-cta">
          <p>
            Substitua as imagens em <code>client/public/gallery</code> pelas fotos reais da
            banda — recomendamos exportar diretamente do Instagram @triadecasamentos_.
          </p>
          <a href={brand.instagram} target="_blank" rel="noreferrer" className="btn btn--dark">
            Ver no Instagram
          </a>
        </div>
      </div>
    </section>
  )
}
