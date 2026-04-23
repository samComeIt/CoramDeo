export function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickDistractors(pool, exclude, n = 3) {
  const candidates = pool.filter((c) => c.id !== exclude.id);
  return shuffle(candidates).slice(0, n);
}

export function buildRoundForAnswer(pool, answer) {
  const distractorCount = Math.min(3, pool.length - 1);
  const distractors = pickDistractors(pool, answer, distractorCount);
  const choices = shuffle([answer, ...distractors]);
  return { answer, choices };
}

export function buildGame(pool, rounds = 10) {
  if (!pool || pool.length === 0) return [];

  const actualRounds = Math.min(rounds, pool.length);
  const answers = shuffle(pool).slice(0, actualRounds);
  return answers.map((answer) => buildRoundForAnswer(pool, answer));
}