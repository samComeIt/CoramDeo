import { useState } from 'react';
import { getCharactersByTopic, TOPICS } from '../../data/characters';
import { buildGame } from '../../utils/gameLogic';
import TopicSelect from './TopicSelect';
import QuestionCard from './QuestionCard';
import ScoreBoard from './ScoreBoard';
import ResultScreen from './ResultScreen';
import './ImageGame.css';

const DEFAULT_ROUNDS = 10;

function ImageGame() {
  const [phase, setPhase] = useState('topic');
  const [rounds, setRounds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [pickedId, setPickedId] = useState(null);

  const currentRound = rounds[currentIndex];

  const handleStart = (selectedTopic, selectedRounds) => {
    const selectedPool = getCharactersByTopic(selectedTopic);
    const builtRounds = buildGame(selectedPool, selectedRounds);
    setRounds(builtRounds);
    setCurrentIndex(0);
    setScore(0);
    setWrongAnswers([]);
    setRevealed(false);
    setPickedId(null);
    setPhase('playing');
  };

  const handleAnswer = (choice) => {
    if (revealed) return;
    setPickedId(choice.id);
    setRevealed(true);
    const isCorrect = choice.id === currentRound.answer.id;
    if (isCorrect) {
      setScore((s) => s + 1);
    } else {
      setWrongAnswers((w) => [
        ...w,
        { answer: currentRound.answer, picked: choice },
      ]);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= rounds.length) {
      setPhase('result');
      return;
    }
    setCurrentIndex((i) => i + 1);
    setRevealed(false);
    setPickedId(null);
  };

  const handlePlayAgain = () => {
    setPhase('topic');
    setRounds([]);
    setCurrentIndex(0);
    setScore(0);
    setWrongAnswers([]);
    setRevealed(false);
    setPickedId(null);
  };

  return (
    <div className="image-game-container">
      <nav className="image-game-nav">
        <div className="nav-brand">
          <h2>이미지 맞추기 게임</h2>
        </div>
      </nav>

      <div className="image-game-content">
        {phase === 'topic' && (
          <TopicSelect onStart={handleStart} defaultRounds={DEFAULT_ROUNDS} />
        )}

        {phase === 'playing' && currentRound && (
          <>
            <ScoreBoard
              round={currentIndex + 1}
              total={rounds.length}
              score={score}
            />
            <QuestionCard
              round={currentRound}
              revealed={revealed}
              pickedId={pickedId}
              onAnswer={handleAnswer}
              onNext={handleNext}
              isLast={currentIndex + 1 >= rounds.length}
            />
          </>
        )}

        {phase === 'result' && (
          <ResultScreen
            score={score}
            total={rounds.length}
            wrongAnswers={wrongAnswers}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </div>
    </div>
  );
}

export default ImageGame;