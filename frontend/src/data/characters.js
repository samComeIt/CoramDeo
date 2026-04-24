export const TOPICS = {
  CARTOON: 'cartoon',
  MOVIE: 'movie',
  REAL: 'real',
  ALL: 'all',
};

export const TOPIC_LABELS = {
  cartoon: '만화 / 애니 캐릭터',
  movie: '영화 / 동화 캐릭터',
  real: '실제 인물',
  all: '전체',
};

export const characters = [
  // Topic 1 — Cartoon / Anime
  { id: 'masha',        nameKr: '마샤',              nameEn: 'Masha',               topic: 'cartoon', image: '/images/cartoon/masha.jpg',        namedImage: '/images/cartoon/masha_named.jpg' },
  { id: 'cheburashka',  nameKr: '체부라시카',         nameEn: 'Cheburashka',         topic: 'cartoon', image: '/images/cartoon/cheburashka.png', namedImage: '/images/cartoon/cheburashka_named.png' },
  { id: 'spongebob',    nameKr: '스폰지밥',           nameEn: 'SpongeBob',           topic: 'cartoon', image: '/images/cartoon/spongebob.png',   namedImage: '/images/cartoon/spongebob_named.png' },
  { id: 'pikachu',      nameKr: '피카츄',             nameEn: 'Pikachu',             topic: 'cartoon', image: '/images/cartoon/pikachu.png',     namedImage: '/images/cartoon/pikachu_named.png' },
  { id: 'doraemon',     nameKr: '도라에몽',           nameEn: 'Doraemon',            topic: 'cartoon', image: '/images/cartoon/doraemon.png',    namedImage: '/images/cartoon/doraemon_named.png' },
  { id: 'pooh',         nameKr: '곰돌이 푸',          nameEn: 'Winnie the Pooh',     topic: 'cartoon', image: '/images/cartoon/pooh.png',        namedImage: '/images/cartoon/pooh_named.png' },
  { id: 'peppa',        nameKr: '페파 피그',          nameEn: 'Peppa Pig',           topic: 'cartoon', image: '/images/cartoon/peppa.png',       namedImage: '/images/cartoon/peppa_named.png' },
  { id: 'ben10',        nameKr: '벤 10',             nameEn: 'Ben 10',              topic: 'cartoon', image: '/images/cartoon/ben10.png',       namedImage: '/images/cartoon/ben10_named.png' },
  { id: 'tom',          nameKr: '톰',                nameEn: 'Tom',                 topic: 'cartoon', image: '/images/cartoon/tom.png',         namedImage: '/images/cartoon/tom_named.png' },
  { id: 'jerry',        nameKr: '제리',              nameEn: 'Jerry',               topic: 'cartoon', image: '/images/cartoon/jerry.png',       namedImage: '/images/cartoon/jerry_named.png' },

  // Topic 2 — Movie / Fairy Tale
  { id: 'elsa',         nameKr: '엘사',              nameEn: 'Elsa',                topic: 'movie',   image: '/images/movie/elsa.png',          namedImage: '/images/movie/elsa_named.png' },
  { id: 'anna',         nameKr: '안나',              nameEn: 'Anna',                topic: 'movie',   image: '/images/movie/anna.png',          namedImage: '/images/movie/anna_named.png' },
  { id: 'cinderella',   nameKr: '신데렐라',           nameEn: 'Cinderella',          topic: 'movie',   image: '/images/movie/cinderella.png',    namedImage: '/images/movie/cinderella_named.png' },
  { id: 'rapunzel',     nameKr: '라푼젤',             nameEn: 'Rapunzel',            topic: 'movie',   image: '/images/movie/rapunzel.png',      namedImage: '/images/movie/rapunzel_named.png' },
  { id: 'aladdin',      nameKr: '알라딘',             nameEn: 'Aladdin',             topic: 'movie',   image: '/images/movie/aladdin.png',       namedImage: '/images/movie/aladdin_named.png' },
  { id: 'genie',        nameKr: '지니',              nameEn: 'Genie',               topic: 'movie',   image: '/images/movie/genie.png',         namedImage: '/images/movie/genie_named.png' },
  { id: 'shrek',        nameKr: '슈렉',              nameEn: 'Shrek',               topic: 'movie',   image: '/images/movie/shrek.png',         namedImage: '/images/movie/shrek_named.png' },
  { id: 'harry',        nameKr: '해리 포터',          nameEn: 'Harry Potter',        topic: 'movie',   image: '/images/movie/harry.jpg',         namedImage: '/images/movie/harry_named.jpg' },
  { id: 'matilda',      nameKr: '마틸다',             nameEn: 'Matilda',             topic: 'movie',   image: '/images/movie/matilda.jpg',       namedImage: '/images/movie/matilda_named.jpg' },
  { id: 'bfg',          nameKr: '빅 프렌들리 자이언트', nameEn: 'The BFG',             topic: 'movie',   image: '/images/movie/bfg.jpg',           namedImage: '/images/movie/bfg_named.jpg' },

  // Topic 3 — Real People
  { id: 'diana',        nameKr: '다이애나 왕세자비',    nameEn: 'Princess Diana',      topic: 'real',    image: '/images/real/diana.jpg',          namedImage: '/images/real/diana_named.jpg' },
  { id: 'einstein',     nameKr: '알버트 아인슈타인',    nameEn: 'Albert Einstein',     topic: 'real',    image: '/images/real/einstein.jpg',       namedImage: '/images/real/einstein_named.jpg' },
  { id: 'sharapova',    nameKr: '마리아 샤라포바',      nameEn: 'Maria Sharapova',     topic: 'real',    image: '/images/real/sharapova.jpg',      namedImage: '/images/real/sharapova_named.jpg' },
  { id: 'messi',        nameKr: '리오넬 메시',         nameEn: 'Lionel Messi',        topic: 'real',    image: '/images/real/messi.jpg',          namedImage: '/images/real/messi_named.jpg' },
  { id: 'ronaldo',      nameKr: '크리스티아누 호날두',   nameEn: 'Cristiano Ronaldo',   topic: 'real',    image: '/images/real/ronaldo.jpg',        namedImage: '/images/real/ronaldo_named.jpg' },
  { id: 'mj',           nameKr: '마이클 잭슨',         nameEn: 'Michael Jackson',     topic: 'real',    image: '/images/real/mj.jpg',             namedImage: '/images/real/mj_named.jpg' },
  { id: 'taylor',       nameKr: '테일러 스위프트',      nameEn: 'Taylor Swift',        topic: 'real',    image: '/images/real/taylor.png',         namedImage: '/images/real/taylor_named.png' },
  { id: 'musk',         nameKr: '일론 머스크',         nameEn: 'Elon Musk',           topic: 'real',    image: '/images/real/musk.jpg',           namedImage: '/images/real/musk_named.jpg' },
  { id: 'jackie',       nameKr: '재키 찬',            nameEn: 'Jackie Chan',         topic: 'real',    image: '/images/real/jackie.jpg',         namedImage: '/images/real/jackie_named.jpg' },
  { id: 'mrbeast',      nameKr: 'MrBeast',           nameEn: 'MrBeast',             topic: 'real',    image: '/images/real/mrbeast.png',        namedImage: '/images/real/mrbeast_named.png' },
];

export function getCharactersByTopic(topic) {
  if (!topic || topic === TOPICS.ALL) return characters;
  return characters.filter((c) => c.topic === topic);
}