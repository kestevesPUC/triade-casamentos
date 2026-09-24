export default function HeroStage() {
  return (
    <div className="hero__stage">
      <div className="sketchfab-embed-wrapper">
        <iframe
          title="Violin"
          className="hero__stage-iframe"
          frameBorder="0"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          src="https://sketchfab.com/models/0162dea1b1044cd281c57af5e5fc2046/embed?autostart=1&ui_theme=dark&ui_infos=0&ui_stop=0&ui_controls=0&ui_watermark=0&ui_watermark_link=0&ui_annotations=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_hint=0&ui_ar=0&ui_ar_qrcode=0&transparent=0"
        />
      </div>
      <p className="hero__stage-credit">
        <a href="https://sketchfab.com/3d-models/violin-0162dea1b1044cd281c57af5e5fc2046" target="_blank" rel="nofollow noreferrer">
          Violin
        </a>{' '}
        by{' '}
        <a href="https://sketchfab.com/Voldepreuss" target="_blank" rel="nofollow noreferrer">
          Voldepreuss
        </a>{' '}
        on{' '}
        <a href="https://sketchfab.com" target="_blank" rel="nofollow noreferrer">
          Sketchfab
        </a>
      </p>
    </div>
  )
}
