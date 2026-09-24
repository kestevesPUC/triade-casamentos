export default function About() {
  return (
    <section id="sobre" className="section about">
      <div className="container about__grid">
        <div className="about__portrait">
          <div className="about__frame" />
          <span>Foto do trio — substitua por uma imagem do Instagram @triadecasamentos_</span>
        </div>

        <div className="about__body">
          <span className="eyebrow">Sobre a Triade</span>
          <h2 style={{ marginTop: 18 }}>Três músicos, uma só emoção</h2>
          <p style={{ marginTop: 24 }}>
            Nascemos da vontade de transformar cerimônias em experiências inesquecíveis. Como
            trio, unimos cordas, voz e sensibilidade para criar uma trilha sonora que conta a
            história de cada casal — do silêncio antes da entrada da noiva à energia da pista de
            dança.
          </p>
          <p>
            Atuamos em Belo Horizonte e região, levando repertório clássico, popular e
            contemporâneo com arranjos autorais. Cada apresentação é construída em parceria com
            os noivos, respeitando o clima e os detalhes que tornam a celebração única.
          </p>
          <p className="about__signature">— Triade Casamentos</p>
        </div>
      </div>
    </section>
  )
}
