import { useState, useMemo, useEffect } from 'react';
import { TOPICS, TOPIC_LABELS, getCharactersByTopic } from '../../data/characters';

const TOPIC_ICONS = {
  cartoon: '🎨',
  movie: '🎬',
  real: '🌟',
};

const TOPIC_ORDER = [TOPICS.CARTOON, TOPICS.MOVIE, TOPICS.REAL];
const ROUND_OPTIONS = [5, 10];

function TopicSelect({ onStart, defaultRounds = 10 }) {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS.CARTOON);
  const [rounds, setRounds] = useState(defaultRounds);

  const poolSize = useMemo(
    () => getCharactersByTopic(selectedTopic).length,
    [selectedTopic]
  );

  useEffect(() => {
    if (rounds > poolSize) setRounds(Math.min(defaultRounds, poolSize));
  }, [poolSize, rounds, defaultRounds]);

  const handleStart = () => {
    onStart(selectedTopic, Math.min(rounds, poolSize));
  };

  return (
    <div className="topic-select">
      <h1 className="topic-select-title">주제를 선택하세요</h1>
      <p className="topic-select-subtitle">이미지를 보고 이름을 맞춰보세요!</p>

      <div className="topic-grid">
        {TOPIC_ORDER.map((topic) => {
          const count = getCharactersByTopic(topic).length;
          const isSelected = selectedTopic === topic;
          return (
            <button
              key={topic}
              type="button"
              className={`topic-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedTopic(topic)}
            >
              <div className="topic-icon">{TOPIC_ICONS[topic]}</div>
              <h3>{TOPIC_LABELS[topic]}</h3>
              <p>{count}개 캐릭터</p>
            </button>
          );
        })}
      </div>

      <div className="rounds-selector">
        <label>문제 수: <span className="rounds-hint">(최대 {poolSize}문제, 이미지 중복 없음)</span></label>
        <div className="rounds-buttons">
          {ROUND_OPTIONS.filter((n) => n <= poolSize).map((n) => (
            <button
              key={n}
              type="button"
              className={`rounds-button ${rounds === n ? 'active' : ''}`}
              onClick={() => setRounds(n)}
            >
              {n}문제
            </button>
          ))}
        </div>
      </div>

      <button className="start-button" onClick={handleStart}>
        게임 시작
      </button>
    </div>
  );
}

export default TopicSelect;