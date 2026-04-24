export const CHARADES_TOPICS = {
  ANIMAL: 'animal',
  ACTION: 'action',
  JOB: 'job',
  CHARACTER: 'character',
  ALL: 'all',
};

export const CHARADES_TOPIC_LABELS = {
  animal: '🐾 동물 / Animals',
  action: '🚶 행동 / Actions',
  job: '🎮 직업 / Jobs',
  character: '🎬 캐릭터 / Characters',
  all: '🎲 전체 / All',
};

export const CHARADES_TOPIC_ICONS = {
  animal: '🐾',
  action: '🚶',
  job: '🎮',
  character: '🎬',
};

export const CHARADES_TOPIC_ORDER = [
  CHARADES_TOPICS.ANIMAL,
  CHARADES_TOPICS.ACTION,
  CHARADES_TOPICS.JOB,
  CHARADES_TOPICS.CHARACTER,
];

export const charades = [
  // 🐾 동물 (가장 쉬움)
  { id: 'dog',       topic: 'animal',    emoji: '🐶', word: '강아지',   wordEn: 'Dog',         hint: '짖기, 꼬리 흔들기',     hintEn: 'Bark, wag tail' },
  { id: 'cat',       topic: 'animal',    emoji: '🐱', word: '고양이',   wordEn: 'Cat',         hint: '야옹, 몸 비비기',        hintEn: 'Meow, rub against' },
  { id: 'rabbit',    topic: 'animal',    emoji: '🐰', word: '토끼',     wordEn: 'Rabbit',      hint: '깡충깡충 뛰기',          hintEn: 'Hop, hop' },
  { id: 'elephant',  topic: 'animal',    emoji: '🐘', word: '코끼리',   wordEn: 'Elephant',    hint: '코 길게 표현',           hintEn: 'Long trunk with arm' },
  { id: 'giraffe',   topic: 'animal',    emoji: '🦒', word: '기린',     wordEn: 'Giraffe',     hint: '목 길게 쭉',             hintEn: 'Stretch neck up' },
  { id: 'monkey',    topic: 'animal',    emoji: '🐵', word: '원숭이',   wordEn: 'Monkey',      hint: '긁적긁적, 점프',         hintEn: 'Scratch, jump' },
  { id: 'penguin',   topic: 'animal',    emoji: '🐧', word: '펭귄',     wordEn: 'Penguin',     hint: '뒤뚱뒤뚱 걷기',          hintEn: 'Waddle walk' },
  { id: 'lion',      topic: 'animal',    emoji: '🦁', word: '사자',     wordEn: 'Lion',        hint: '어흥!',                 hintEn: 'Roar!' },

  // 🚶 행동 / 일상
  { id: 'brush',     topic: 'action',    emoji: '🪥', word: '양치하기', wordEn: 'Brush teeth', hint: '칫솔질하는 동작',        hintEn: 'Brushing motion' },
  { id: 'eat',       topic: 'action',    emoji: '🍽️', word: '밥 먹기',   wordEn: 'Eat',         hint: '숟가락, 젓가락 쓰기',     hintEn: 'Use spoon / chopsticks' },
  { id: 'sleep',     topic: 'action',    emoji: '😴', word: '잠자기',   wordEn: 'Sleep',       hint: '손 모아 베개',           hintEn: 'Hands as pillow' },
  { id: 'cry',       topic: 'action',    emoji: '😭', word: '울기',     wordEn: 'Cry',         hint: '눈물 흘리는 시늉',        hintEn: 'Wiping tears' },
  { id: 'laugh',     topic: 'action',    emoji: '😂', word: '웃기',     wordEn: 'Laugh',       hint: '박수 치며 웃기',          hintEn: 'Clap and laugh' },
  { id: 'run',       topic: 'action',    emoji: '🏃', word: '달리기',   wordEn: 'Run',         hint: '제자리 달리기',           hintEn: 'Run in place' },
  { id: 'swim',      topic: 'action',    emoji: '🏊', word: '수영',     wordEn: 'Swim',        hint: '팔 크게 저으며 헤엄',      hintEn: 'Big arm strokes' },

  // 🎮 직업 / 역할놀이
  { id: 'doctor',    topic: 'job',       emoji: '🩺', word: '의사',     wordEn: 'Doctor',      hint: '청진기 흉내',            hintEn: 'Pretend stethoscope' },
  { id: 'police',    topic: 'job',       emoji: '👮', word: '경찰',     wordEn: 'Police',      hint: '호루라기, 단속',         hintEn: 'Whistle, stop sign' },
  { id: 'firefighter', topic: 'job',     emoji: '🚒', word: '소방관',   wordEn: 'Firefighter', hint: '호스로 불 끄기',         hintEn: 'Spray fire with hose' },
  { id: 'chef',      topic: 'job',       emoji: '👨‍🍳', word: '요리사',   wordEn: 'Chef',        hint: '프라이팬 흔들기',        hintEn: 'Shake the pan' },
  { id: 'teacher',   topic: 'job',       emoji: '👨‍🏫', word: '선생님',   wordEn: 'Teacher',     hint: '칠판에 쓰기',            hintEn: 'Write on board' },

  // 🎬 캐릭터
  { id: 'pororo',    topic: 'character', emoji: '🐧', word: '뽀로로',   wordEn: 'Pororo',      hint: '안경 쓴 펭귄, 날개 푸드덕', hintEn: 'Penguin with glasses, flap wings' },
  { id: 'pikachu',   topic: 'character', emoji: '⚡', word: '피카츄',   wordEn: 'Pikachu',     hint: '피카피카! 번개',          hintEn: 'Pika pika! Lightning' },
  { id: 'jjangu',    topic: 'character', emoji: '👦', word: '짱구',     wordEn: 'Shin-chan',   hint: '엉덩이 흔들기',           hintEn: 'Wiggle your bottom' },
  { id: 'elsa',      topic: 'character', emoji: '❄️', word: '엘사',     wordEn: 'Elsa',        hint: '얼음 마법 쏘기',          hintEn: 'Shoot ice magic' },
  { id: 'spiderman', topic: 'character', emoji: '🕷️', word: '스파이더맨', wordEn: 'Spider-Man',  hint: '거미줄 쏘는 손 모양',      hintEn: 'Web-shooter hand pose' },
];

export function getCharadesByTopic(topic) {
  if (!topic || topic === CHARADES_TOPICS.ALL) return charades;
  return charades.filter((c) => c.topic === topic);
}