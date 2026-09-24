import { videos } from '../data/site.js'

export default function Videos() {
  return (
    <section id="videos" className="section videos">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">Veja e ouça</span>
          <h2 style={{ marginTop: 18 }}>Vídeos de apresentações reais</h2>
          <p>Uma seleção de vídeos (não listados no YouTube) de cerimônias e recepções que já tivemos o prazer de embalar.</p>
        </div>

        <div className="videos-grid">
          {videos.map((video, i) => (
            <article className="video-card" key={`${video.id}-${i}`}>
              <div className="video-card__frame">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.id}`}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="video-card__body">
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            </article>
          ))}
        </div>

        <p className="videos-note">
          Vídeos exibidos via YouTube (modo não listado). Substitua os IDs em{' '}
          <code>client/src/data/site.js</code> pelos vídeos enviados pela banda.
        </p>
      </div>
    </section>
  )
}
