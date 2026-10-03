# Nossos Momentos

Um site estilo Spotify, romântico, com player de música, carrossel de fotos e vídeos — tudo servido do seu Supabase Storage.

## Como adicionar conteúdo (sem mexer em código)

Entre no [Supabase Dashboard](https://supabase.com/dashboard) → seu projeto → **Storage**. Existem 3 buckets públicos prontos:

| Bucket | O que colocar | Aparece onde |
|---|---|---|
| `music` | Arquivos `.mp3`, `.m4a`, `.ogg` etc. | Playlist lateral + player |
| `photos` | Fotos `.jpg`, `.png`, `.webp` | Carrossel "Nossos Momentos" |
| `videos` | Vídeos `.mp4`, `.webm`, `.mov` | Carrossel "Nossos Vídeos" |

Basta subir os arquivos na raiz de cada bucket — o site lista tudo automaticamente (até 200 arquivos por bucket).

**Dica:** o nome do arquivo vira o título da música/foto. Use `Nossa primeira viagem.mp3` em vez de `IMG_1234.mp3`.

## Como editar os textos (declaração, nomes, data)

Tudo está em `src/config/content.ts`:

- `coupleNames` — nomes do casal
- `tagline` — frase do topo
- `startDate` — data de início do relacionamento (alimenta o contador "X dias juntos")
- `declaration.paragraphs` — a sua declaração (quantos parágrafos quiser)
- `declaration.signature` — assinatura

Depois de editar, commit + push e a Vercel publica sozinha.

## Rodar localmente

```bash
npm install
npm run dev
```

As chaves do Supabase já estão embutidas como fallback (são chaves públicas de navegador).
Para sobrescrever, copie `.env.example` para `.env` e preencha.

## Deploy (Vercel)

1. Acesse [vercel.com/new](https://vercel.com/new) e importe este repositório.
2. A Vercel detecta Vite automaticamente (build: `npm run build`, output: `dist`).
3. (Opcional) Adicione as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
4. Deploy. A cada push na branch `main` o site atualiza sozinho.
