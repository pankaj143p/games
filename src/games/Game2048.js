import React, { useState, useEffect, useCallback } from 'react';
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

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    gap: 8px;
    padding: 12px;
  }
`;

const Tile = styled(motion.div)`
  width: 70px;
  height: 70px;
  background: ${props => getTileColor(props.value)};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.value > 999 ? '1.2rem' : '1.5rem'};
  font-weight: 700;
  color: ${props => props.value <= 2 ? '#776e65' : 'white'};
  text-shadow: ${props => props.value > 2 ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'};
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    font-size: ${props => props.value > 999 ? '1rem' : '1.3rem'};
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    font-size: ${props => props.value > 999 ? '0.9rem' : '1.1rem'};
  }
`;

const EmptyTile = styled.div`
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
  
  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
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

const NewGameButton = styled(motion.button)`
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
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

function getTileColor(value) {
  const colors = {
    0: 'rgba(255, 255, 255, 0.1)',
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
    4096: '#ff6b6b',
    8192: '#ee5a24',
  };
  return colors[value] || '#3c3a32';
}

function Game2048({ onScoreUpdate, onGameEnd }) {
  const [board, setBoard] = useState(() => initializeBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  function initializeBoard() {
    const newBoard = Array(16).fill(0);
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }

  function addRandomTile(board) {
    const emptyTiles = board.map((tile, index) => tile === 0 ? index : null).filter(val => val !== null);
    if (emptyTiles.length > 0) {
      const randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      board[randomIndex] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  const moveLeft = useCallback(() => {
    const newBoard = [...board];
    let moved = false;
    let newScore = score;

    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 0; j < 4; j++) {
        if (newBoard[i * 4 + j] !== 0) {
          row.push(newBoard[i * 4 + j]);
        }
      }

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          newScore += row[j];
          if (row[j] === 2048 && !won) {
            setWon(true);
          }
          row.splice(j + 1, 1);
        }
      }

      while (row.length < 4) {
        row.push(0);
      }

      for (let j = 0; j < 4; j++) {
        if (newBoard[i * 4 + j] !== row[j]) {
          moved = true;
        }
        newBoard[i * 4 + j] = row[j];
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      onScoreUpdate(newScore);
    }

    return moved;
  }, [board, score, onScoreUpdate, won]);

  const moveRight = useCallback(() => {
    const newBoard = [...board];
    let moved = false;
    let newScore = score;

    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 3; j >= 0; j--) {
        if (newBoard[i * 4 + j] !== 0) {
          row.push(newBoard[i * 4 + j]);
        }
      }

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          newScore += row[j];
          if (row[j] === 2048 && !won) {
            setWon(true);
          }
          row.splice(j + 1, 1);
        }
      }

      while (row.length < 4) {
        row.push(0);
      }

      for (let j = 0; j < 4; j++) {
        if (newBoard[i * 4 + (3 - j)] !== row[j]) {
          moved = true;
        }
        newBoard[i * 4 + (3 - j)] = row[j];
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      onScoreUpdate(newScore);
    }

    return moved;
  }, [board, score, onScoreUpdate, won]);

  const moveUp = useCallback(() => {
    const newBoard = [...board];
    let moved = false;
    let newScore = score;

    for (let j = 0; j < 4; j++) {
      const column = [];
      for (let i = 0; i < 4; i++) {
        if (newBoard[i * 4 + j] !== 0) {
          column.push(newBoard[i * 4 + j]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          newScore += column[i];
          if (column[i] === 2048 && !won) {
            setWon(true);
          }
          column.splice(i + 1, 1);
        }
      }

      while (column.length < 4) {
        column.push(0);
      }

      for (let i = 0; i < 4; i++) {
        if (newBoard[i * 4 + j] !== column[i]) {
          moved = true;
        }
        newBoard[i * 4 + j] = column[i];
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      onScoreUpdate(newScore);
    }

    return moved;
  }, [board, score, onScoreUpdate, won]);

  const moveDown = useCallback(() => {
    const newBoard = [...board];
    let moved = false;
    let newScore = score;

    for (let j = 0; j < 4; j++) {
      const column = [];
      for (let i = 3; i >= 0; i--) {
        if (newBoard[i * 4 + j] !== 0) {
          column.push(newBoard[i * 4 + j]);
        }
      }

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          newScore += column[i];
          if (column[i] === 2048 && !won) {
            setWon(true);
          }
          column.splice(i + 1, 1);
        }
      }

      while (column.length < 4) {
        column.push(0);
      }

      for (let i = 0; i < 4; i++) {
        if (newBoard[(3 - i) * 4 + j] !== column[i]) {
          moved = true;
        }
        newBoard[(3 - i) * 4 + j] = column[i];
      }
    }

    if (moved) {
      addRandomTile(newBoard);
      setBoard(newBoard);
      setScore(newScore);
      onScoreUpdate(newScore);
    }

    return moved;
  }, [board, score, onScoreUpdate, won]);

  const checkGameOver = useCallback(() => {
    // Check for empty tiles
    if (board.includes(0)) return false;

    // Check for possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = board[i * 4 + j];
        if (
          (j < 3 && current === board[i * 4 + j + 1]) ||
          (i < 3 && current === board[(i + 1) * 4 + j])
        ) {
          return false;
        }
      }
    }
    return true;
  }, [board]);

  useEffect(() => {
    if (checkGameOver()) {
      setGameOver(true);
      onGameEnd(score);
    }
  }, [board, checkGameOver, onGameEnd, score]);

  // Touch controls
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50) {
          moveLeft();
        } else if (diffX < -50) {
          moveRight();
        }
      } else {
        if (diffY > 50) {
          moveUp();
        } else if (diffY < -50) {
          moveDown();
        }
      }

      startX = 0;
      startY = 0;
    };

    // Keyboard controls
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          moveUp();
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          moveDown();
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
  }, [moveLeft, moveRight, moveUp, moveDown]);

  const resetGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setWon(false);
    onScoreUpdate(0);
  };

  return (
    <GameContainer>
      <Board>
        {board.map((value, index) => (
          value === 0 ? (
            <EmptyTile key={index} />
          ) : (
            <Tile
              key={`${index}-${value}`}
              value={value}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {value}
            </Tile>
          )
        ))}
      </Board>

      <Controls>
        <ControlText>
          📱 Swipe or use arrow keys to move tiles
        </ControlText>
        <ControlText>
          🎯 Combine tiles to reach 2048!
        </ControlText>
        <NewGameButton
          onClick={resetGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Game
        </NewGameButton>
      </Controls>

      <AnimatePresence>
        {(gameOver || won) && (
          <GameOverOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameOverTitle>
              {won ? 'You Win!' : 'Game Over!'}
            </GameOverTitle>
            <GameOverScore>
              Final Score: {score.toLocaleString()}
            </GameOverScore>
            <NewGameButton
              onClick={resetGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Play Again
            </NewGameButton>
          </GameOverOverlay>
        )}
      </AnimatePresence>
    </GameContainer>
  );
}

export default Game2048;
