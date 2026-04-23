function getGrade(ratio) {
  if (ratio === 1) return { label: '완벽해요! 🏆', tone: 'perfect' };
  if (ratio >= 0.8) return { label: '훌륭해요! 🎉', tone: 'great' };
  if (ratio >= 0.5) return { label: '좋아요! 👍', tone: 'good' };
  return { label: '다시 도전해볼까요? 💪', tone: 'retry' };
}

function ResultScreen({ score, total, wrongAnswers, onPlayAgain }) {
  const ratio = total > 0 ? score / total : 0;
  const percent = Math.round(ratio * 100);
  const grade = getGrade(ratio);

  return (
    <div className="result-screen">
      <h1 className="result-title">게임 종료</h1>
      <div className={`result-score ${grade.tone}`}>
        <div className="result-score-big">
          {score} <span className="result-score-slash">/</span> {total}
        </div>
        <div className="result-score-percent">{percent}%</div>
        <div className="result-grade">{grade.label}</div>
      </div>

      {wrongAnswers.length > 0 && (
        <div className="wrong-review">
          <h3>틀린 문제 다시보기</h3>
          <div className="wrong-review-list">
            {wrongAnswers.map((item, idx) => (
              <div key={idx} className="wrong-review-item">
                <img
                  src={item.answer.image}
                  alt={item.answer.nameKr}
                  className="wrong-review-image"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="wrong-review-info">
                  <div className="wrong-review-correct">
                    정답: <strong>{item.answer.nameKr}</strong>
                  </div>
                  <div className="wrong-review-picked">
                    선택: {item.picked.nameKr}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="play-again-button" onClick={onPlayAgain}>
        다시 하기
      </button>
    </div>
  );
}

export default ResultScreen;