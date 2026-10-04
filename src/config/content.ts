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
      'Provavelmente esperei dar 00:00 do dia 13 de outubro para te mandar isso. ❤️',
      'Acabamos de assistir Verity kkkkk, e acho que não poderia existir momento melhor para escrever tudo isso.',
      'Entrar no seu mundinho é um caminho sem volta… mas, sinceramente, tudo é perfeito ao seu lado.',
      'Queria te agradecer por cada momento que passamos juntos. Cada conversa, cada risada, cada beijo, cada aventura e cada momento simples ao seu lado se tornou especial para mim. Você é, sim, uma das maiores alegrias da minha vida e a mulher por quem eu me apaixono cada dia mais.',
      'Você é muito especial para mim. Muito mesmo.',
      'Há um ano, você não fazia ideia do quanto eu estava quebrado. Eu estava destruído por causa de relacionamento, problemas financeiros, ansiedade e tantas outras coisas que estavam acontecendo ao mesmo tempo. E eu acredito que, por algum acaso — ou talvez por um propósito de Deus — nós fomos colocados na vida um do outro de uma maneira tão especial.',
      'Eu já te conhecia há algum tempo. Como falei no começo, nós éramos até amigos no Facebook kkkkk. E o mais engraçado é que, mesmo assim, nunca tínhamos conversado por lá.',
      'Mas, de alguma forma, você apareceu na minha vida exatamente quando eu mais precisava. E, sinceramente, às vezes penso que, se você não tivesse aparecido, talvez eu nem estivesse aqui hoje, considerando tudo o que estava acontecendo comigo naquela época.',
      'Você foi alguém com quem eu consegui me sentir em paz novamente. Alguém que me fez sentir alegria, vontade de viver, vontade de aproveitar as coisas boas da vida. E, desde então, nossas aventuras, nossos beijos, nossas conversas e todos os nossos momentos foram se tornando partes muito importantes da minha história.',
      'Se hoje estamos juntos, pode ter certeza de que acredito que existe um propósito nisso.',
      'Ainda mais depois de um ano ficando, sem conseguir nos desgrudar, falando todos os dias e fazendo cada vez mais parte da vida um do outro. Fernanda, você já faz parte da minha rotina. Faz parte dos meus pensamentos, dos meus dias e dos meus planos.',
      'Eu te amo muito.',
      'E quero que você tenha certeza de uma coisa: eu não estou aqui por uma questão carnal, por algo passageiro ou por simplesmente "pegar e jogar fora". Muito menos estou aqui sem a intenção de permanecer na sua vida.',
      'Muito pelo contrário.',
      'O que eu mais quero é continuar te conquistando todos os dias, se a vida nos der essa oportunidade. Quero continuar cuidando de você, vivendo momentos ao seu lado e construindo algo cada vez mais bonito entre nós.',
      'Você sabe que eu seria o homem mais feliz do mundo em poder acordar ao seu lado, fazer parte da sua vida, da sua rotina, dos seus planos e de todos aqueles pequenos detalhes que fazem parte de quem você é.',
      'Você é incrível.',
      'Obrigado por existir, Fernanda. Obrigado de verdade.',
      'Você não sabe o orgulho que eu sinto de você. Tenho orgulho de te ver crescendo, de compartilhar suas risadas, de estar presente nos seus momentos e de poder conhecer cada vez mais a mulher maravilhosa que você é.',
      'Eu tenho um cuidado muito especial por você. E, acima de tudo, eu quero permanecer com você.',
      'Quero continuar vivendo nossas histórias, criando novas lembranças, compartilhando nossas risadas, nossos planos, nossas aventuras e tudo aquilo que ainda está por vir.',
      'Talvez eu não saiba exatamente o que o futuro nos reserva, mas sei o que quero hoje: quero você na minha vida.',
      'Muito obrigado por existir. ❤️',
      'E obrigado por, de alguma forma, ter aparecido na minha vida quando eu mais precisava.',
      'Eu te amo, Fernanda.',
    ],
    signature: '',
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
