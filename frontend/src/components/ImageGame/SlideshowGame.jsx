import { useState } from 'react';
import { getCharactersByTopic } from '../../data/characters';
import { shuffle } from '../../utils/gameLogic';
import TopicSelect from './TopicSelect';
import SlideCard from './SlideCard';
import './ImageGame.css';
import './SlideshowGame.css';

const DEFAULT_ROUNDS = 10;

function SlideshowGame() {
  const [phase, setPhase] = useState('topic');
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showName, setShowName] = useState(false);

  const currentSlide = slides[currentIndex];

  const handleStart = (selectedTopic, selectedRounds) => {
    const pool = getCharactersByTopic(selectedTopic);
    const count = Math.min(selectedRounds, pool.length);
    const picked = shuffle(pool).slice(0, count);
    setSlides(picked);
    setCurrentIndex(0);
    setShowName(false);
    setPhase('playing');
  };

  const handleReveal = () => setShowName(true);

  const handleNext = () => {
    if (currentIndex + 1 >= slides.length) {
      setPhase('done');
      return;
    }
    setCurrentIndex((i) => i + 1);
    setShowName(false);
  };

  const handlePlayAgain = () => {
    setPhase('topic');
    setSlides([]);
    setCurrentIndex(0);
    setShowName(false);
  };

  return (
    <div className="image-game-container">
      <nav className="image-game-nav">
        <div className="nav-brand">
          <h2>이미지 슬라이드쇼</h2>
        </div>
      </nav>

      <div className="image-game-content">
        {phase === 'topic' && (
          <TopicSelect onStart={handleStart} defaultRounds={DEFAULT_ROUNDS} />
        )}

        {phase === 'playing' && currentSlide && (
          <SlideCard
            slide={currentSlide}
            index={currentIndex}
            total={slides.length}
            showName={showName}
            onReveal={handleReveal}
            onNext={handleNext}
            isLast={currentIndex + 1 >= slides.length}
          />
        )}

        {phase === 'done' && (
          <div className="slideshow-done">
            <h1>끝!</h1>
            <p>모든 이미지를 보셨습니다.</p>
            <button className="play-again-button" onClick={handlePlayAgain}>
              다시 하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SlideshowGame;