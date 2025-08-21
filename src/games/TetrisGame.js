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
  display: flex;
  gap: 20px;
  align-items: flex-start;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
`;

const GameBoard = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(20, 1fr);
  gap: 1px;
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  width: 300px;
  height: 600px;
  
  @media (max-width: 768px) {
    width: 250px;
    height: 500px;
  }
  
  @media (max-width: 480px) {
    width: 220px;
    height: 440px;
  }
`;

const Cell = styled.div`
  background: ${props => props.filled ? props.color : 'rgba(255, 255, 255, 0.05)'};
  border: ${props => props.filled ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'};
  border-radius: 2px;
  transition: all 0.1s ease;
`;

const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }
`;

const InfoPanel = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 20px;
  color: white;
  min-width: 150px;
  
  @media (max-width: 768px) {
    padding: 15px;
    min-width: 120px;
  }
`;

const StatItem = styled.div`
  text-align: center;
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #a8e6cf;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const NextPiecePreview = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
  margin-top: 10px;
`;

const PreviewCell = styled.div`
  width: 15px;
  height: 15px;
  background: ${props => props.filled ? props.color : 'transparent'};
  border: ${props => props.filled ? '1px solid rgba(255, 255, 255, 0.3)' : 'none'};
  border-radius: 2px;
  
  @media (max-width: 768px) {
    width: 12px;
    height: 12px;
  }
`;

const Controls = styled.div`
  text-align: center;
  color: white;
  margin-top: 20px;
`;

const ControlText = styled.p`
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 10px;
`;

const ActionButton = styled(motion.button)`
  background: linear-gradient(135deg, #a8e6cf, #7fcdcd);
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
    box-shadow: 0 5px 15px rgba(168, 230, 207, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TouchControls = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  max-width: 300px;
  margin-top: 15px;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const TouchButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  color: white;
  padding: 15px 10px;
  font-size: 0.9rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const GameOverOverlay = styled(motion.div)`
  position: fixed;
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
  color: #a8e6cf;
`;

const GameOverScore = styled.p`
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.9;
`;

// Tetris pieces
const PIECES = {
  I: {
    shape: [
      [1, 1, 1, 1]
    ],
    color: '#00f5ff'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#ffff00'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: '#a000f0'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#00f000'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#f00000'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: '#0000f0'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: '#f0a000'
  }
};

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

function TetrisGame({ onScoreUpdate, onGameEnd }) {
  const [board, setBoard] = useState(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => 
      Array(BOARD_WIDTH).fill({ filled: false, color: null })
    )
  );
  const [currentPiece, setCurrentPiece] = useState(null);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [dropTime, setDropTime] = useState(1000);
  const gameLoopRef = useRef();
  const dropTimeRef = useRef(1000);

  const getRandomPiece = useCallback(() => {
    const pieceKeys = Object.keys(PIECES);
    const randomKey = pieceKeys[Math.floor(Math.random() * pieceKeys.length)];
    return { ...PIECES[randomKey], type: randomKey };
  }, []);

  const rotatePiece = useCallback((piece) => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  const isValidPosition = useCallback((piece, position, gameBoard) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = position.x + x;
          const newY = position.y + y;
          
          if (
            newX < 0 || 
            newX >= BOARD_WIDTH || 
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && gameBoard[newY][newX].filled)
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback((piece, position, gameBoard) => {
    const newBoard = gameBoard.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = { filled: true, color: piece.color };
          }
        }
      }
    }
    
    return newBoard;
  }, []);

  const clearLines = useCallback((gameBoard) => {
    const newBoard = [];
    let linesCleared = 0;
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (gameBoard[y].every(cell => cell.filled)) {
        linesCleared++;
      } else {
        newBoard.unshift(gameBoard[y]);
      }
    }
    
    // Add empty lines at the top
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill({ filled: false, color: null }));
    }
    
    return { board: newBoard, linesCleared };
  }, []);

  const spawnNewPiece = useCallback(() => {
    const piece = nextPiece || getRandomPiece();
    const position = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
    
    if (!isValidPosition(piece, position, board)) {
      setGameOver(true);
      setGameRunning(false);
      onGameEnd(score);
      return;
    }
    
    setCurrentPiece(piece);
    setCurrentPosition(position);
    setNextPiece(getRandomPiece());
  }, [nextPiece, getRandomPiece, isValidPosition, board, onGameEnd, score]);

  const movePiece = useCallback((dx, dy) => {
    if (!currentPiece || !gameRunning) return false;
    
    const newPosition = { x: currentPosition.x + dx, y: currentPosition.y + dy };
    
    if (isValidPosition(currentPiece, newPosition, board)) {
      setCurrentPosition(newPosition);
      return true;
    }
    
    return false;
  }, [currentPiece, currentPosition, isValidPosition, board, gameRunning]);

  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || !gameRunning) return;
    
    const rotatedPiece = rotatePiece(currentPiece);
    
    if (isValidPosition(rotatedPiece, currentPosition, board)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, rotatePiece, isValidPosition, currentPosition, board, gameRunning]);

  const dropPiece = useCallback(() => {
    if (!movePiece(0, 1)) {
      // Piece can't move down, place it
      const newBoard = placePiece(currentPiece, currentPosition, board);
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      
      if (linesCleared > 0) {
        const newLines = lines + linesCleared;
        const newLevel = Math.floor(newLines / 10) + 1;
        const pointsForLines = linesCleared * 100 * level;
        const newScore = score + pointsForLines;
        
        setLines(newLines);
        setLevel(newLevel);
        setScore(newScore);
        onScoreUpdate(newScore);
        
        // Increase speed
        const newDropTime = Math.max(100, 1000 - (newLevel - 1) * 100);
        setDropTime(newDropTime);
        dropTimeRef.current = newDropTime;
      }
      
      spawnNewPiece();
    }
  }, [movePiece, placePiece, currentPiece, currentPosition, board, clearLines, lines, level, score, onScoreUpdate, spawnNewPiece]);

  const hardDrop = useCallback(() => {
    if (!currentPiece || !gameRunning) return;
    
    let droppedDistance = 0;
    while (movePiece(0, 1)) {
      droppedDistance++;
    }
    
    // Award points for hard drop
    const bonusPoints = droppedDistance * 2;
    const newScore = score + bonusPoints;
    setScore(newScore);
    onScoreUpdate(newScore);
    
    dropPiece();
  }, [currentPiece, gameRunning, movePiece, dropPiece, score, onScoreUpdate]);

  // Game loop
  useEffect(() => {
    if (gameRunning) {
      gameLoopRef.current = setInterval(() => {
        dropPiece();
      }, dropTimeRef.current);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [dropPiece, gameRunning]);

  // Update drop time when it changes
  useEffect(() => {
    dropTimeRef.current = dropTime;
  }, [dropTime]);

  // Controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameRunning) return;
      
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          dropPiece();
          break;
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          rotatePieceHandler();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [movePiece, dropPiece, rotatePieceHandler, hardDrop, gameRunning]);

  const startGame = () => {
    setGameRunning(true);
    setGameOver(false);
    if (!currentPiece) {
      spawnNewPiece();
    }
  };

  const pauseGame = () => {
    setGameRunning(false);
  };

  const resetGame = () => {
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => 
      Array(BOARD_WIDTH).fill({ filled: false, color: null })
    ));
    setCurrentPiece(null);
    setCurrentPosition({ x: 0, y: 0 });
    setNextPiece(null);
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameRunning(false);
    setGameOver(false);
    setDropTime(1000);
    onScoreUpdate(0);
  };

  // Render board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    // Add current piece to display board
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const boardY = currentPosition.y + y;
            const boardX = currentPosition.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = { filled: true, color: currentPiece.color };
            }
          }
        }
      }
    }
    
    return displayBoard.flat().map((cell, index) => (
      <Cell
        key={index}
        filled={cell.filled}
        color={cell.color}
      />
    ));
  };

  // Render next piece preview
  const renderNextPiece = () => {
    const preview = Array(16).fill({ filled: false, color: null });
    
    if (nextPiece) {
      for (let y = 0; y < nextPiece.shape.length; y++) {
        for (let x = 0; x < nextPiece.shape[y].length; x++) {
          if (nextPiece.shape[y][x]) {
            const index = y * 4 + x;
            if (index < 16) {
              preview[index] = { filled: true, color: nextPiece.color };
            }
          }
        }
      }
    }
    
    return preview.map((cell, index) => (
      <PreviewCell
        key={index}
        filled={cell.filled}
        color={cell.color}
      />
    ));
  };

  return (
    <GameContainer>
      <GameArea>
        <GameBoard>
          {renderBoard()}
        </GameBoard>
        
        <SidePanel>
          <InfoPanel>
            <StatItem>
              <StatValue>{score.toLocaleString()}</StatValue>
              <StatLabel>Score</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{lines}</StatValue>
              <StatLabel>Lines</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{level}</StatValue>
              <StatLabel>Level</StatLabel>
            </StatItem>
          </InfoPanel>
          
          <InfoPanel>
            <StatLabel style={{ textAlign: 'center', marginBottom: '10px' }}>Next Piece</StatLabel>
            <NextPiecePreview>
              {renderNextPiece()}
            </NextPiecePreview>
          </InfoPanel>
        </SidePanel>
      </GameArea>

      <Controls>
        <ControlText>
          ⌨️ Arrow keys or WASD to move • Space to hard drop
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

      <TouchControls>
        <TouchButton
          onTouchStart={() => movePiece(-1, 0)}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </TouchButton>
        <TouchButton
          onTouchStart={() => rotatePieceHandler()}
          whileTap={{ scale: 0.9 }}
        >
          ↻
        </TouchButton>
        <TouchButton
          onTouchStart={() => movePiece(1, 0)}
          whileTap={{ scale: 0.9 }}
        >
          →
        </TouchButton>
        <TouchButton
          onTouchStart={() => hardDrop()}
          whileTap={{ scale: 0.9 }}
        >
          Drop
        </TouchButton>
      </TouchControls>

      <AnimatePresence>
        {gameOver && (
          <GameOverOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <GameOverTitle>Game Over!</GameOverTitle>
            <GameOverScore>Score: {score.toLocaleString()}</GameOverScore>
            <GameOverScore>Lines: {lines}</GameOverScore>
            <GameOverScore>Level: {level}</GameOverScore>
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
    </GameContainer>
  );
}

export default TetrisGame;
