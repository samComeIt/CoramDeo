import { useState, useEffect } from 'react';

function CharadesCard({ card, index, total, showHint, onNext, isLast }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(false);
  }, [card.id]);

  return (
    <div className="question-card charades-card">
      <div className="charades-progress">
        {index + 1} / {total}
      </div>

      {!revealed ? (
        <>
          <div className="charades-cover">
            <div className="charades-cover-icon">❓</div>
            <p className="charades-cover-text">카드를 눌러 문제 확인</p>
          </div>
          <button
            className="next-button"
            onClick={() => setRevealed(true)}
          >
            카드 보기
          </button>
        </>
      ) : (
        <>
          <div className="charades-emoji-wrapper">
            <div className="charades-emoji">{card.emoji}</div>
            <div className="charades-word">{card.word}</div>
            {card.wordEn && (
              <div className="charades-word-en">{card.wordEn}</div>
            )}
            {showHint && card.hint && (
              <div className="charades-hint">
                💡 {card.hint}
                {card.hintEn && (
                  <span className="charades-hint-en"> / {card.hintEn}</span>
                )}
              </div>
            )}
          </div>
          <button className="next-button" onClick={onNext}>
            {isLast ? '끝내기' : '다음 →'}
          </button>
        </>
      )}
    </div>
  );
}

export default CharadesCard;