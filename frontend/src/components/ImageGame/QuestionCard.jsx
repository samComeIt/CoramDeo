import { useState } from 'react';

function QuestionCard({ round, revealed, pickedId, onAnswer, onNext, isLast }) {
  const [imageError, setImageError] = useState(false);
  const { answer, choices } = round;
  const isCorrect = revealed && pickedId === answer.id;

  const getChoiceClass = (choice) => {
    if (!revealed) return 'choice-button';
    if (choice.id === answer.id) return 'choice-button correct';
    if (choice.id === pickedId) return 'choice-button wrong';
    return 'choice-button dimmed';
  };

  return (
    <div className="question-card">
      <div className="question-image-wrapper">
        {imageError ? (
          <div className="image-placeholder">
            <div className="placeholder-icon">🖼️</div>
            <p>이미지 없음</p>
            <small>{answer.image}</small>
          </div>
        ) : (
          <img
            key={answer.id}
            src={answer.image}
            alt="누구일까요?"
            className="question-image"
            onError={() => setImageError(true)}
            onLoad={() => setImageError(false)}
          />
        )}
        {revealed && (
          <div className={`feedback-overlay ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? '정답!' : `오답! 정답: ${answer.nameKr}`}
          </div>
        )}
      </div>

      <div className="choices-grid">
        {choices.map((choice) => (
          <button
            key={choice.id}
            type="button"
            className={getChoiceClass(choice)}
            onClick={() => onAnswer(choice)}
            disabled={revealed}
          >
            {choice.nameKr}
          </button>
        ))}
      </div>

      {revealed && (
        <button className="next-button" onClick={onNext}>
          {isLast ? '결과 보기' : '다음 문제 →'}
        </button>
      )}
    </div>
  );
}

export default QuestionCard;