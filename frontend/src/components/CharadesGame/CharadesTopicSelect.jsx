import { useState, useMemo, useEffect } from 'react';
import {
  CHARADES_TOPICS,
  CHARADES_TOPIC_LABELS,
  CHARADES_TOPIC_ICONS,
  CHARADES_TOPIC_ORDER,
  getCharadesByTopic,
} from '../../data/charades';

const ROUND_OPTIONS = [5, 10, 15];

function CharadesTopicSelect({ onStart, defaultRounds = 10 }) {
  const [selectedTopic, setSelectedTopic] = useState(CHARADES_TOPICS.ANIMAL);
  const [rounds, setRounds] = useState(defaultRounds);
  const [showHint, setShowHint] = useState(true);

  const poolSize = useMemo(
    () => getCharadesByTopic(selectedTopic).length,
    [selectedTopic]
  );

  useEffect(() => {
    if (rounds > poolSize) setRounds(Math.min(defaultRounds, poolSize));
  }, [poolSize, rounds, defaultRounds]);

  const handleStart = () => {
    onStart(selectedTopic, Math.min(rounds, poolSize), showHint);
  };

  const topicsWithAll = [...CHARADES_TOPIC_ORDER, CHARADES_TOPICS.ALL];

  return (
    <div className="topic-select">
      <h1 className="topic-select-title">주제를 선택하세요</h1>
      <p className="topic-select-subtitle">
        이모지를 보고 몸으로 표현해보세요!
      </p>

      <div className="topic-grid">
        {topicsWithAll.map((topic) => {
          const count = getCharadesByTopic(topic).length;
          const isSelected = selectedTopic === topic;
          const icon =
            topic === CHARADES_TOPICS.ALL ? '🎲' : CHARADES_TOPIC_ICONS[topic];
          return (
            <button
              key={topic}
              type="button"
              className={`topic-card ${isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedTopic(topic)}
            >
              <div className="topic-icon">{icon}</div>
              <h3>{CHARADES_TOPIC_LABELS[topic]}</h3>
              <p>{count}개</p>
            </button>
          );
        })}
      </div>

      <div className="rounds-selector">
        <label>
          문제 수:{' '}
          <span className="rounds-hint">
            (최대 {poolSize}문제, 중복 없음)
          </span>
        </label>
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
          {poolSize > 0 && !ROUND_OPTIONS.some((n) => n <= poolSize) && (
            <button
              type="button"
              className="rounds-button active"
              onClick={() => setRounds(poolSize)}
            >
              {poolSize}문제
            </button>
          )}
        </div>
      </div>

      <div className="hint-toggle">
        <label className="hint-toggle-label">
          <input
            type="checkbox"
            checked={showHint}
            onChange={(e) => setShowHint(e.target.checked)}
          />
          <span>동작 힌트 표시</span>
        </label>
      </div>

      <button className="start-button" onClick={handleStart}>
        게임 시작
      </button>
    </div>
  );
}

export default CharadesTopicSelect;