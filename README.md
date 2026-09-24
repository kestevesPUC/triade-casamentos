# Triade Casamentos

Site institucional da **Triade Casamentos** — trio de músicos para cerimônias e recepções de casamento em Belo Horizonte e região.

- **Front-end:** React + Vite (`client/`)
- **Back-end:** Node.js — função serverless em `api/contact.js` (compatível com Vercel Functions), com um wrapper Express em `server/` só para rodar localmente.
- **Deploy:** Vercel (front-end estático + `api/` como serverless functions)
- **3D:** violino interativo no hero (arraste para girar), feito com `three` + `@react-three/fiber`. Carrega automaticamente `client/public/models/violin.glb` se o arquivo existir; caso contrário usa um violino procedural gerado por código; e se WebGL não estiver disponível, cai para um SVG estático. Veja `client/public/models/README.txt` para instruções de download do modelo (Sketchfab, licença CC Attribution).

## Estrutura

```
triadecasamentos/
├─ client/           # App React (Vite)
│  ├─ src/
│  │  ├─ components/ # Header, Hero, About, Services, Videos, Gallery, Testimonials, Contact, Footer, Violin3D
│  │  └─ data/site.js # Conteúdo editável (marca, vídeos, galeria, depoimentos)
│  └─ public/gallery/ # Coloque aqui as fotos reais da banda
├─ api/contact.js    # Função serverless (Vercel) do formulário de contato
├─ server/           # Servidor Express só para dev local (reusa api/contact.js)
└─ vercel.json
```

## Rodando localmente

```bash
npm install
npm run dev          # front-end em http://localhost:5173
npm run dev:api      # back-end em http://localhost:3001 (outro terminal)
```

O Vite já está configurado para fazer proxy de `/api` para `http://localhost:3001`.

## Conteúdo a personalizar

1. **Vídeos do YouTube (não listados)** — edite `client/src/data/site.js`, array `videos`, trocando o `id` pelo ID de cada vídeo (parte final da URL `https://youtu.be/SEU_ID`).
2. **Fotos da galeria** — salve as imagens em `client/public/gallery/` com os nomes `foto-1.jpg` … `foto-6.jpg` (ou ajuste os caminhos em `site.js`).
3. **WhatsApp, e-mail e Instagram** — objeto `brand` em `site.js`.
4. **Depoimentos e serviços** — arrays `testimonials` e `services` em `site.js`.
5. **Foto do "Sobre"** — troque o placeholder em `About.jsx` por uma `<img>` real.

## Formulário de contato

`api/contact.js` valida os campos, aplica um honeypot anti-spam e um rate limit simples por IP. Para receber os leads por e-mail, configure as variáveis de ambiente (veja `.env.example`) no painel da Vercel:

```
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
CONTACT_TO_EMAIL=
```

Sem essas variáveis, os leads são apenas registrados no log da função (útil para testar antes de configurar o e-mail).

## Deploy na Vercel

1. Suba este repositório para o GitHub.
2. Importe o projeto na Vercel — o `vercel.json` já define build (`client/dist`) e as funções em `api/`.
3. Configure as variáveis de ambiente de SMTP (opcional) em **Project Settings → Environment Variables**.
4. Deploy.

## Acessibilidade e performance

- Contraste AA, foco visível em todos os elementos interativos, navegação por teclado.
- `prefers-reduced-motion` respeitado (desativa auto-rotação do violino 3D e demais animações).
- Cena 3D com fallback estático (SVG) caso WebGL falhe ou não esteja disponível.
- Imagens com `loading="lazy"`, vídeos do YouTube em `youtube-nocookie.com` e `loading="lazy"`.
