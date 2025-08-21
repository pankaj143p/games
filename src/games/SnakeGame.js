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

const GameBoard = styled.div`
  position: relative;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    width: 300px;
    height: 300px;
  }
  
  @media (max-width: 480px) {
    width: 280px;
    height: 280px;
  }
`;

const SnakeSegment = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  @media (max-width: 768px) {
    width: 15px;
    height: 15px;
  }
`;

const SnakeHead = styled(SnakeSegment)`
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border-radius: 6px;
  box-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
`;

const Food = styled(motion.div)`
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #ffd93d, #ff6b6b);
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 15px rgba(255, 217, 61, 0.7);
  
  @media (max-width: 768px) {
    width: 15px;
    height: 15px;
  }
`;

const Controls = styled.div`
  text-align: center;
  color: white;
  margin-bottom: 20px;
`;

const ControlText = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 10px;
`;

const GameStats = styled.div`
  display: flex;
  gap: 30px;
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
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #4ecdc4;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #4ecdc4, #44a08d);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin: 0 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(76, 205, 196, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  color: #ff6b6b;
`;

const GameOverScore = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.9;
`;

const DirectionButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  max-width: 200px;
  margin-top: 10px;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const DirectionButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  color: white;
  padding: 15px;
  font-size: 1.2rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

function SnakeGame({ onScoreUpdate, onGameEnd }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(GAME_SPEED);
  const gameLoopRef = useRef();

  const getBoardSize = () => {
    if (window.innerWidth <= 480) return { width: 280, height: 280, cellSize: 14 };
    if (window.innerWidth <= 768) return { width: 300, height: 300, cellSize: 15 };
    return { width: 400, height: 400, cellSize: 20 };
  };

  const { width, height, cellSize } = getBoardSize();
  const gridCols = Math.floor(width / cellSize);
  const gridRows = Math.floor(height / cellSize);

  const generateFood = useCallback(() => {
    let newFood;
    const isValidPosition = (x, y) => {
      return !snake.some(segment => segment.x === x && segment.y === y);
    };
    
    do {
      newFood = {
        x: Math.floor(Math.random() * gridCols),
        y: Math.floor(Math.random() * gridRows)
      };
    } while (!isValidPosition(newFood.x, newFood.y));
    
    return newFood;
  }, [snake, gridCols, gridRows]);

  const moveSnake = useCallback(() => {
    if (!gameRunning || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= gridCols || head.y < 0 || head.y >= gridRows) {
        setGameOver(true);
        setGameRunning(false);
        onGameEnd(score);
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        setGameRunning(false);
        onGameEnd(score);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreUpdate(newScore);
        setFood(generateFood());
        
        // Increase speed every 5 food items
        if (newScore % 50 === 0) {
          setSpeed(prevSpeed => Math.max(prevSpeed - 20, 80));
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameRunning, gameOver, score, onScoreUpdate, onGameEnd, generateFood, gridCols, gridRows]);

  // Game loop
  useEffect(() => {
    if (gameRunning) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake, gameRunning, speed]);

  const toggleGame = useCallback(() => {
    if (gameOver) return;
    setGameRunning(!gameRunning);
  }, [gameOver, gameRunning]);

  // Touch controls
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (!startX || !startY || !gameRunning) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 30 && direction.x !== 1) {
          setDirection({ x: -1, y: 0 });
        } else if (diffX < -30 && direction.x !== -1) {
          setDirection({ x: 1, y: 0 });
        }
      } else {
        if (diffY > 30 && direction.y !== 1) {
          setDirection({ x: 0, y: -1 });
        } else if (diffY < -30 && direction.y !== -1) {
          setDirection({ x: 0, y: 1 });
        }
      }

      startX = 0;
      startY = 0;
    };

    // Keyboard controls
    const handleKeyPress = (e) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case ' ':
          e.preventDefault();
          toggleGame();
          break;
        default:
          break;
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [direction, gameRunning, toggleGame]);

  const startGame = () => {
    setGameRunning(true);
    setGameOver(false);
  };

  const pauseGame = () => {
    setGameRunning(false);
  };

  const toggleGame = useCallback(() => {
    if (gameOver) return;
    setGameRunning(!gameRunning);
  }, [gameOver, gameRunning]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 15, y: 15 });
    setDirection(INITIAL_DIRECTION);
    setGameRunning(false);
    setGameOver(false);
    setScore(0);
    setSpeed(GAME_SPEED);
    onScoreUpdate(0);
  };

  const changeDirection = (newDirection) => {
    if (!gameRunning) return;
    
    // Prevent reverse direction
    if (
      (newDirection.x === 1 && direction.x === -1) ||
      (newDirection.x === -1 && direction.x === 1) ||
      (newDirection.y === 1 && direction.y === -1) ||
      (newDirection.y === -1 && direction.y === 1)
    ) {
      return;
    }
    
    setDirection(newDirection);
  };

  return (
    <GameContainer>
      <GameStats>
        <StatItem>
          <StatValue>{score}</StatValue>
          <StatLabel>Score</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{snake.length}</StatValue>
          <StatLabel>Length</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{Math.max(200 - speed, 0)}</StatValue>
          <StatLabel>Speed</StatLabel>
        </StatItem>
      </GameStats>

      <GameBoard style={{ width, height }}>
        {/* Snake */}
        {snake.map((segment, index) => (
          index === 0 ? (
            <SnakeHead
              key={`head-${segment.x}-${segment.y}`}
              style={{
                left: segment.x * cellSize,
                top: segment.y * cellSize,
                width: cellSize,
                height: cellSize
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.1 }}
            />
          ) : (
            <SnakeSegment
              key={`segment-${index}-${segment.x}-${segment.y}`}
              style={{
                left: segment.x * cellSize,
                top: segment.y * cellSize,
                width: cellSize,
                height: cellSize
              }}
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.1 }}
            />
          )
        ))}

        {/* Food */}
        <Food
          style={{
            left: food.x * cellSize,
            top: food.y * cellSize,
            width: cellSize,
            height: cellSize
          }}
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <AnimatePresence>
          {gameOver && (
            <GameOverOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GameOverTitle>Game Over!</GameOverTitle>
              <GameOverScore>
                Final Score: {score}
              </GameOverScore>
              <GameOverScore>
                Snake Length: {snake.length}
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
      </GameBoard>

      <Controls>
        <ControlText>
          📱 Swipe to change direction • ⌨️ Use arrow keys or WASD
        </ControlText>
        <div>
          {!gameRunning && !gameOver && (
            <ActionButton
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Game
            </ActionButton>
          )}
          {gameRunning && (
            <ActionButton
              onClick={pauseGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Pause
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

      <DirectionButtons>
        <div></div>
        <DirectionButton
          onClick={() => changeDirection({ x: 0, y: -1 })}
          disabled={!gameRunning}
          whileTap={{ scale: 0.9 }}
        >
          ↑
        </DirectionButton>
        <div></div>
        
        <DirectionButton
          onClick={() => changeDirection({ x: -1, y: 0 })}
          disabled={!gameRunning}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </DirectionButton>
        <DirectionButton
          onClick={toggleGame}
          whileTap={{ scale: 0.9 }}
        >
          {gameRunning ? '⏸️' : '▶️'}
        </DirectionButton>
        <DirectionButton
          onClick={() => changeDirection({ x: 1, y: 0 })}
          disabled={!gameRunning}
          whileTap={{ scale: 0.9 }}
        >
          →
        </DirectionButton>
        
        <div></div>
        <DirectionButton
          onClick={() => changeDirection({ x: 0, y: 1 })}
          disabled={!gameRunning}
          whileTap={{ scale: 0.9 }}
        >
          ↓
        </DirectionButton>
        <div></div>
      </DirectionButtons>
    </GameContainer>
  );
}

export default SnakeGame;
