import { brand } from '../data/site.js'
import HeroStage from './HeroStage.jsx'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="hero__texture" />
      <div className="container hero__grid">
        <div className="hero__copy">
          <span className="eyebrow">Música ao vivo para casamentos</span>
          <h1 className="hero__title">
            A trilha sonora do <em>seu</em> grande dia
          </h1>
          <p className="hero__lede">
            {brand.name} é um trio de músicos especializado em cerimônias e recepções de
            casamento em {brand.location}. Repertório sob medida, sensibilidade artística e
            presença marcante do primeiro acorde ao último brinde.
          </p>

          <div className="hero__actions">
            <a href={brand.whatsapp} target="_blank" rel="noreferrer" className="btn btn--gold">
              Solicitar orçamento
            </a>
            <a href="#videos" className="btn btn--outline">
              Assistir vídeos
            </a>
          </div>

          <div className="hero__meta">
            <div>
              <strong>150+</strong>
              <span>Casamentos realizados</span>
            </div>
            <div>
              <strong>4.9★</strong>
              <span>Avaliação das noivas</span>
            </div>
            <div>
              <strong>3</strong>
              <span>Músicos, um só trio</span>
            </div>
          </div>
        </div>

        <HeroStage />
      </div>

      <a href="#sobre" className="hero__scroll">
        <span className="hero__scroll-line" />
        Rolar
      </a>
    </section>
  )
}
