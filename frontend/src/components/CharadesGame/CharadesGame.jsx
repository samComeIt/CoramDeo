import { useState } from 'react';
import { getCharadesByTopic } from '../../data/charades';
import { shuffle } from '../../utils/gameLogic';
import CharadesTopicSelect from './CharadesTopicSelect';
import CharadesCard from './CharadesCard';
import '../ImageGame/ImageGame.css';
import './CharadesGame.css';

const DEFAULT_ROUNDS = 10;

function CharadesGame() {
  const [phase, setPhase] = useState('topic');
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);

  const currentCard = cards[currentIndex];

  const handleStart = (selectedTopic, selectedRounds, hintEnabled) => {
    const pool = getCharadesByTopic(selectedTopic);
    const count = Math.min(selectedRounds, pool.length);
    const picked = shuffle(pool).slice(0, count);
    setCards(picked);
    setCurrentIndex(0);
    setShowHint(hintEnabled);
    setPhase('playing');
  };

  const handleNext = () => {
    if (currentIndex + 1 >= cards.length) {
      setPhase('done');
      return;
    }
    setCurrentIndex((i) => i + 1);
  };

  const handlePlayAgain = () => {
    setPhase('topic');
    setCards([]);
    setCurrentIndex(0);
  };

  return (
    <div className="image-game-container">
      <nav className="image-game-nav">
        <div className="nav-brand">
          <h2>🎭 몸으로 말해요</h2>
        </div>
      </nav>

      <div className="image-game-content">
        {phase === 'topic' && (
          <CharadesTopicSelect
            onStart={handleStart}
            defaultRounds={DEFAULT_ROUNDS}
          />
        )}

        {phase === 'playing' && currentCard && (
          <CharadesCard
            card={currentCard}
            index={currentIndex}
            total={cards.length}
            showHint={showHint}
            onNext={handleNext}
            isLast={currentIndex + 1 >= cards.length}
          />
        )}

        {phase === 'done' && (
          <div className="charades-done">
            <h1>🎉 끝!</h1>
            <p>모든 카드를 다 했어요.</p>
            <button className="play-again-button" onClick={handlePlayAgain}>
              다시 하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CharadesGame;