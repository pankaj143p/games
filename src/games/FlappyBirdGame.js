import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const GameArea = styled.div`
  position: relative;
  width: 400px;
  height: 600px;
  background: linear-gradient(180deg, #87CEEB 0%, #98FB98 100%);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  
  @media (max-width: 768px) {
    width: 350px;
    height: 500px;
  }
  
  @media (max-width: 480px) {
    width: 300px;
    height: 450px;
  }
`;

const Bird = styled(motion.div)`
  position: absolute;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #ffd93d, #ff6b6b);
  border-radius: 50%;
  border: 3px solid #fff;
  box-shadow: 0 0 10px rgba(255, 217, 61, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 10;
  
  &::before {
    content: '🐦';
    font-size: 1.5rem;
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    
    &::before {
      font-size: 1.3rem;
    }
  }
`;

const Pipe = styled(motion.div)`
  position: absolute;
  width: 60px;
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  border: 2px solid #1B5E20;
  border-radius: 5px;
  
  @media (max-width: 768px) {
    width: 50px;
  }
`;

const ScoreDisplay = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-weight: 700;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  z-index: 100;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    top: 15px;
  }
`;

const Instructions = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  z-index: 100;
`;

const InstructionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const InstructionText = styled.p`
  font-size: 1rem;
  margin-bottom: 5px;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Controls = styled.div`
  text-align: center;
  color: white;
  margin-top: 20px;
`;

const ControlText = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 10px;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #ffd93d, #ff6b6b);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 0 5px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 217, 61, 0.3);
  }
`;

const GameOverOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  color: white;
  text-align: center;
  border-radius: 15px;
`;

const GameOverTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 10px;
  color: #ffd93d;
`;

const GameOverScore = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.9;
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    gap: 20px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  color: white;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #ffd93d;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 3;

function FlappyBirdGame({ onScoreUpdate, onGameEnd }) {
  const [bird, setBird] = useState({ x: 100, y: 300, velocity: 0 });
  const [pipes, setPipes] = useState([]);
  const [score, setScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameAreaRef = useRef();
  const animationRef = useRef();

  const getGameDimensions = () => {
    if (window.innerWidth <= 480) return { width: 300, height: 450 };
    if (window.innerWidth <= 768) return { width: 350, height: 500 };
    return { width: 400, height: 600 };
  };

  const { width: gameWidth, height: gameHeight } = getGameDimensions();

  const jump = useCallback(() => {
    if (!gameRunning || gameOver) return;
    setBird(prev => ({ ...prev, velocity: JUMP_FORCE }));
  }, [gameRunning, gameOver]);

  const generatePipe = useCallback((x) => {
    const minHeight = 50;
    const maxHeight = gameHeight - PIPE_GAP - 50;
    const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    return {
      id: Math.random(),
      x,
      topHeight,
      bottomHeight: gameHeight - topHeight - PIPE_GAP,
      passed: false
    };
  }, [gameHeight]);

  const checkCollision = useCallback((birdPos, pipeList) => {
    // Check ground and ceiling
    if (birdPos.y <= 0 || birdPos.y >= gameHeight - 40) {
      return true;
    }

    // Check pipe collision
    for (let pipe of pipeList) {
      if (
        birdPos.x + 40 > pipe.x &&
        birdPos.x < pipe.x + PIPE_WIDTH &&
        (birdPos.y < pipe.topHeight || birdPos.y + 40 > gameHeight - pipe.bottomHeight)
      ) {
        return true;
      }
    }

    return false;
  }, [gameHeight]);

  const gameLoop = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setBird(prevBird => {
      const newBird = {
        ...prevBird,
        y: prevBird.y + prevBird.velocity,
        velocity: prevBird.velocity + GRAVITY
      };

      return newBird;
    });

    setPipes(prevPipes => {
      let newPipes = prevPipes.map(pipe => ({
        ...pipe,
        x: pipe.x - PIPE_SPEED
      })).filter(pipe => pipe.x > -PIPE_WIDTH);

      // Add new pipes
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < gameWidth - 200) {
        newPipes.push(generatePipe(gameWidth));
      }

      // Check for score
      newPipes = newPipes.map(pipe => {
        if (!pipe.passed && pipe.x + PIPE_WIDTH < bird.x) {
          pipe.passed = true;
          const newScore = score + 1;
          setScore(newScore);
          onScoreUpdate(newScore);
        }
        return pipe;
      });

      return newPipes;
    });

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameRunning, gameOver, bird.x, score, onScoreUpdate, generatePipe, gameWidth]);

  // Check collision in separate effect
  useEffect(() => {
    if (gameRunning && !gameOver) {
      if (checkCollision(bird, pipes)) {
        setGameOver(true);
        setGameRunning(false);
        onGameEnd(score);
      }
    }
  }, [bird, pipes, gameRunning, gameOver, checkCollision, onGameEnd, score]);

  // Start game loop
  useEffect(() => {
    if (gameRunning) {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, gameRunning]);

  const startGame = useCallback(() => {
    setGameRunning(true);
    setGameOver(false);
    setGameStarted(true);
    setBird({ x: 100, y: 300, velocity: 0 });
    setPipes([generatePipe(gameWidth)]);
  }, [generatePipe, gameWidth]);

  // Controls
  useEffect(() => {
    const handleClick = () => {
      if (!gameStarted) {
        startGame();
      } else {
        jump();
      }
    };

    const handleKeyPress = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        if (!gameStarted) {
          startGame();
        } else {
          jump();
        }
      }
    };

    const handleTouch = (e) => {
      e.preventDefault();
      if (!gameStarted) {
        startGame();
      } else {
        jump();
      }
    };

    const gameArea = gameAreaRef.current;
    if (gameArea) {
      gameArea.addEventListener('click', handleClick);
      gameArea.addEventListener('touchstart', handleTouch);
    }
    
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      if (gameArea) {
        gameArea.removeEventListener('click', handleClick);
        gameArea.removeEventListener('touchstart', handleTouch);
      }
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [jump, gameStarted, startGame]);

  const resetGame = () => {
    setGameRunning(false);
    setGameOver(false);
    setGameStarted(false);
    setBird({ x: 100, y: 300, velocity: 0 });
    setPipes([]);
    setScore(0);
    onScoreUpdate(0);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  return (
    <GameContainer>
      <StatsContainer>
        <StatItem>
          <StatValue>{score}</StatValue>
          <StatLabel>Score</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{gameRunning ? 'Flying' : 'Ready'}</StatValue>
          <StatLabel>Status</StatLabel>
        </StatItem>
      </StatsContainer>

      <GameArea 
        ref={gameAreaRef}
        style={{ width: gameWidth, height: gameHeight }}
      >
        <ScoreDisplay>{score}</ScoreDisplay>

        {!gameStarted && (
          <Instructions>
            <InstructionTitle>🐦 Flappy Bird</InstructionTitle>
            <InstructionText>Tap or press SPACE to fly</InstructionText>
            <InstructionText>Avoid the pipes!</InstructionText>
            <InstructionText>👆 Click anywhere to start</InstructionText>
          </Instructions>
        )}

        <Bird
          style={{
            left: bird.x,
            top: bird.y,
          }}
          animate={{
            rotate: Math.max(-30, Math.min(30, bird.velocity * 3))
          }}
          transition={{ duration: 0.1 }}
        />

        {pipes.map(pipe => (
          <React.Fragment key={pipe.id}>
            {/* Top pipe */}
            <Pipe
              style={{
                left: pipe.x,
                top: 0,
                height: pipe.topHeight,
              }}
              initial={{ x: gameWidth }}
              animate={{ x: pipe.x }}
              transition={{ duration: 0.1 }}
            />
            
            {/* Bottom pipe */}
            <Pipe
              style={{
                left: pipe.x,
                bottom: 0,
                height: pipe.bottomHeight,
              }}
              initial={{ x: gameWidth }}
              animate={{ x: pipe.x }}
              transition={{ duration: 0.1 }}
            />
          </React.Fragment>
        ))}

        <AnimatePresence>
          {gameOver && (
            <GameOverOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GameOverTitle>Game Over!</GameOverTitle>
              <GameOverScore>Score: {score}</GameOverScore>
              <GameOverScore>
                {score === 0 ? 'Try again!' : 
                 score < 5 ? 'Keep practicing!' :
                 score < 10 ? 'Getting better!' :
                 score < 20 ? 'Great job!' :
                 'Amazing score!'}
              </GameOverScore>
              <ActionButton
                onClick={resetGame}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </ActionButton>
            </GameOverOverlay>
          )}
        </AnimatePresence>
      </GameArea>

      <Controls>
        <ControlText>
          👆 Tap screen or press SPACE to fly • Avoid the green pipes!
        </ControlText>
        
        <div>
          {!gameRunning && (
            <ActionButton
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {gameStarted ? 'Continue' : 'Start Game'}
            </ActionButton>
          )}
          
          <ActionButton
            onClick={resetGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Reset
          </ActionButton>
        </div>
      </Controls>
    </GameContainer>
  );
}

export default FlappyBirdGame;
