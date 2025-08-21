import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import GameSelection from './components/GameSelection';
import Game2048 from './games/Game2048';
import SnakeGame from './games/SnakeGame';
import TetrisGame from './games/TetrisGame';
import FlappyBirdGame from './games/FlappyBirdGame';
import SpaceInvadersGame from './games/SpaceInvadersGame';
import ScoreSystem from './components/ScoreSystem';

const AppContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  flex-direction: column;
  position: relative;
`;

const GameContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  color: white;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  z-index: 1000;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    totalScore: 0,
    averageScore: 0
  });

  // Load saved data from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('ddgaming-high-score');
    const savedStats = localStorage.getItem('ddgaming-stats');
    
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
  }, []);

  // Save data when score changes
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('ddgaming-high-score', score.toString());
    }
  }, [score, highScore]);

  const handleGameEnd = (finalScore) => {
    const newStats = {
      gamesPlayed: gameStats.gamesPlayed + 1,
      totalScore: gameStats.totalScore + finalScore,
      averageScore: Math.round((gameStats.totalScore + finalScore) / (gameStats.gamesPlayed + 1))
    };
    
    setGameStats(newStats);
    localStorage.setItem('ddgaming-stats', JSON.stringify(newStats));
  };

  const renderGame = () => {
    const gameProps = {
      onScoreUpdate: setScore,
      onGameEnd: handleGameEnd,
      currentScore: score
    };

    switch (selectedGame) {
      case '2048':
        return <Game2048 {...gameProps} />;
      case 'snake':
        return <SnakeGame {...gameProps} />;
      case 'tetris':
        return <TetrisGame {...gameProps} />;
      case 'flappy':
        return <FlappyBirdGame {...gameProps} />;
      case 'invaders':
        return <SpaceInvadersGame {...gameProps} />;
      default:
        return null;
    }
  };

  return (
    <AppContainer>
      <AnimatePresence mode="wait">
        {!selectedGame ? (
          <motion.div
            key="selection"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <GameSelection 
              onSelectGame={setSelectedGame}
              highScore={highScore}
              gameStats={gameStats}
            />
          </motion.div>
        ) : (
          <GameContainer
            key={selectedGame}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <BackButton
              onClick={() => {
                setSelectedGame(null);
                setScore(0);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Games
            </BackButton>
            
            <ScoreSystem 
              currentScore={score}
              highScore={highScore}
              gameName={selectedGame}
            />
            
            {renderGame()}
          </GameContainer>
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

export default App;
