function ScoreBoard({ round, total, score }) {
  const progress = total > 0 ? ((round - 1) / total) * 100 : 0;

  return (
    <div className="scoreboard">
      <div className="scoreboard-row">
        <div className="scoreboard-item">
          <span className="scoreboard-label">문제</span>
          <span className="scoreboard-value">
            {round} / {total}
          </span>
        </div>
        <div className="scoreboard-item">
          <span className="scoreboard-label">점수</span>
          <span className="scoreboard-value">{score}</span>
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default ScoreBoard;