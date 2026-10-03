// =====================================================================
//  EDITE AQUI — Tudo que você quer personalizar fica neste arquivo.
//  Depois de editar, faça commit/push (ou me peça para atualizar).
// =====================================================================

export const content = {
  // Nomes do casal (aparecem no topo e no título da página)
  coupleNames: 'Eu & Você',

  // Frase curta abaixo dos nomes
  tagline: 'Cada música, cada foto, cada vídeo… um pedacinho da nossa história.',

  // Data e hora em que vocês começaram — alimenta o contador animado "dias juntos"
  startDate: { year: 2025, month: 10, day: 13, hour: 9, minute: 26 },

  // Sua declaração (aparece na seção "Uma carta para você")
  declaration: {
    title: 'Uma carta para você',
    paragraphs: [
      'Escreva aqui a sua declaração. Este é o primeiro parágrafo — conte como tudo começou, aquele momento em que você percebeu que ela era especial.',
      'Este é o segundo parágrafo — fale do que você mais ama nela, dos detalhes pequenos que fazem a diferença.',
      'E este é o último parágrafo — termine com a promessa, o sonho ou a frase final que vai derreter o coração dela. ❤',
    ],
    signature: 'Com todo o meu amor, — Seu nome',
  },

  // Nome que aparece na playlist do lado esquerdo
  playlistName: 'Nossa Trilha Sonora',

  // Nome do "artista" mostrado nas músicas (se quiser, mude para o nome de vocês)
  defaultArtist: 'Nossas músicas',

  // Frase mostrada quando a lista de músicas/fotos/vídeos está vazia
  emptyHints: {
    music: 'Adicione arquivos .mp3 no bucket "music" do Supabase Storage e eles aparecem aqui automaticamente.',
    photos: 'Adicione fotos no bucket "photos" do Supabase Storage e o carrossel se monta sozinho.',
    videos: 'Adicione vídeos no bucket "videos" do Supabase Storage e eles aparecem aqui automaticamente.',
  },
};

export type Content = typeof content;
