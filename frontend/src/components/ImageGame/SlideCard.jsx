import { useState, useEffect } from 'react';

function SlideCard({ slide, index, total, showName, onReveal, onNext, isLast }) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [slide.id]);

  return (
    <div className="question-card slideshow-card">
      <div className="slideshow-progress">
        {index + 1} / {total}
      </div>

      <div className="question-image-wrapper">
        {imageError ? (
          <div className="image-placeholder">
            <div className="placeholder-icon">🖼️</div>
            <p>이미지 없음</p>
            <small>{slide.image}</small>
          </div>
        ) : (
          <img
            key={slide.id}
            src={slide.image}
            alt={showName ? slide.nameKr : '이미지'}
            className="question-image"
            onError={() => setImageError(true)}
          />
        )}
        {showName && (
          <div className="slideshow-name-overlay">
            <span>{slide.nameKr}</span>
          </div>
        )}
      </div>

      {!showName ? (
        <button className="next-button" onClick={onReveal}>
          이름 보기
        </button>
      ) : (
        <button className="next-button" onClick={onNext}>
          {isLast ? '끝내기' : '다음 →'}
        </button>
      )}
    </div>
  );
}

export default SlideCard;