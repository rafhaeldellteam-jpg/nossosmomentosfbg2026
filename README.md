# Nossos Momentos

Um site estilo Spotify, romântico, com player de música, carrossel de fotos e vídeos — tudo servido do seu Supabase Storage.

## Como adicionar conteúdo (sem mexer em código)

1. Acesse o [Supabase Dashboard](https://supabase.com/dashboard) → seu projeto → **Storage**.
2. Crie os 3 buckets abaixo (se não estiverem):
   - `music` — arquivos `.mp3`, `.m4a`, `.ogg` etc. (play lista + player)
   - `photos` — fotos `.jpg`, `.png`, `.webp`
   - `videos` — vídeos `.mp4`, `.webm`, `.mov`
3. Sobe os arquivos na **raiz** de cada bucket. O site lista tudo automaticamente (até 200 arquivos por bucket).
4. **Dica:** o nome do arquivo vira o título. Use `Nossa primeira viagem.mp3` em vez de `IMG_1234.mp3`.

Depois de subir, o carrossel e a playlist aparecem sozinhos. Para reordenar, use o **Painel Admin** (abaixo).

## Como editar os textos (declaração, nomes, data)

Tudo fica em `src/config/content.ts`:

- `coupleNames` — nomes do casal
- `tagline` — frase do topo
- `startDate` — data de início (alimenta o contador "X dias juntos")
- `declaration.paragraphs` — a sua declaração
- `declaration.signature` / `signatureName`
- `playlistName`, `defaultArtist`, `emptyHints`

Edite, commit e push — a Vercel publica sozinha.

## Proteger o painel admin

O painel `#/admin` **pode aparecer para qualquer pessoa** que abra o link. Se o site for público, defina o segredo:

1. Abra `src/config/content.ts`
2. Preencha `adminSecret` com uma palavra/passe que só vocês conheçam
3. Acesse o admin com o link `/#/admin?secret=SUA-PALAVRA`

Você também pode rodar o SQL de seed abaixo (na seção "SQL de configuração") antes de publicar. A senha não fica salva no código; o admin só abre quando você digitar/a enviar o `secret`.

## Rodar localmente

```bash
npm install
npm run dev
```

## Deploy (Vercel)

1. `vercel.com/new` → importe este repositório
2. Vite é detectado automaticamente (build: `npm run build`, output: `dist`)
3. (Opcional) adicione as variáveis de ambiente `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
4. Deploy. A cada push na branch `main` o site atualiza sozinho.

## SQL de configuração (Supabase)

Para evitar problemas de permissão do painel, rode no **SQL Editor** do Supabase:

1. `supabase/migrations/001_media_order.sql` — cria a tabela `media_order` + seed.
2. (Opcional) restrinja o acesso à tabela `media_order` com policies do seu próprio perfil
   (o anon key só pode ler o que uma policy permitir).

---

Feito com amor — cada detalhe aqui é nosso.
