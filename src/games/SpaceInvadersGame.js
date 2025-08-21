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
  width: 500px;
  height: 600px;
  background: linear-gradient(180deg, #000428 0%, #004e92 100%);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 350px;
    height: 500px;
  }
  
  @media (max-width: 480px) {
    width: 300px;
    height: 450px;
  }
`;

const Player = styled(motion.div)`
  position: absolute;
  width: 40px;
  height: 30px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 5px;
  border: 2px solid #fff;
  box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  z-index: 10;
  
  &::before {
    content: '🚀';
    font-size: 1.5rem;
  }
  
  @media (max-width: 768px) {
    width: 35px;
    height: 25px;
    
    &::before {
      font-size: 1.2rem;
    }
  }
`;

const Invader = styled(motion.div)`
  position: absolute;
  width: 30px;
  height: 25px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border-radius: 3px;
  border: 1px solid #fff;
  box-shadow: 0 0 8px rgba(255, 107, 107, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &::before {
    content: '👾';
    font-size: 1rem;
  }
  
  @media (max-width: 768px) {
    width: 25px;
    height: 20px;
    
    &::before {
      font-size: 0.8rem;
    }
  }
`;

const Bullet = styled(motion.div)`
  position: absolute;
  width: 4px;
  height: 10px;
  background: ${props => props.enemy ? '#ff6b6b' : '#00ff00'};
  border-radius: 2px;
  box-shadow: 0 0 5px ${props => props.enemy ? '#ff6b6b' : '#00ff00'};
  
  @media (max-width: 768px) {
    width: 3px;
    height: 8px;
  }
`;

const PowerUp = styled(motion.div)`
  position: absolute;
  width: 25px;
  height: 25px;
  background: linear-gradient(135deg, #ffd93d, #ff6b6b);
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 0 10px rgba(255, 217, 61, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  
  &::before {
    content: '⭐';
    font-size: 1rem;
  }
`;

const UI = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-weight: 600;
  z-index: 100;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const Lives = styled.div`
  display: flex;
  gap: 5px;
`;

const Heart = styled.span`
  color: #ff6b6b;
  font-size: 1.2rem;
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
  background: linear-gradient(135deg, #667eea, #764ba2);
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
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
  }
`;

const TouchControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
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
  padding: 15px 20px;
  font-size: 1rem;
  cursor: pointer;
  backdrop-filter: blur(10px);
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
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
  color: ${props => props.won ? '#00ff00' : '#ff6b6b'};
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
  color: #667eea;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

function SpaceInvadersGame({ onScoreUpdate, onGameEnd }) {
  const [player, setPlayer] = useState({ x: 250, y: 550 });
  const [invaders, setInvaders] = useState([]);
  const [bullets, setBullets] = useState([]);
  const [enemyBullets, setEnemyBullets] = useState([]);
  const [powerUps, setPowerUps] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [wave, setWave] = useState(1);
  const [gameRunning, setGameRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [powerUpActive, setPowerUpActive] = useState(false);
  const animationRef = useRef();
  const keysRef = useRef({});

  const getGameDimensions = () => {
    if (window.innerWidth <= 480) return { width: 300, height: 450 };
    if (window.innerWidth <= 768) return { width: 350, height: 500 };
    return { width: 500, height: 600 };
  };

  const { width: gameWidth, height: gameHeight } = getGameDimensions();

  const createInvaderGrid = useCallback((waveNumber) => {
    const invadersList = [];
    const rows = 4 + Math.floor(waveNumber / 3);
    const cols = 8;
    const spacing = 40;
    const startX = (gameWidth - (cols - 1) * spacing) / 2;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        invadersList.push({
          id: Math.random(),
          x: startX + col * spacing,
          y: 50 + row * 35,
          health: row === 0 ? 2 : 1 // Front row has more health
        });
      }
    }
    return invadersList;
  }, [gameWidth]);

  const movePlayer = useCallback((direction) => {
    if (!gameRunning) return;
    
    setPlayer(prev => {
      const speed = 8;
      let newX = prev.x;
      
      if (direction === 'left' && prev.x > 0) {
        newX = Math.max(0, prev.x - speed);
      } else if (direction === 'right' && prev.x < gameWidth - 40) {
        newX = Math.min(gameWidth - 40, prev.x + speed);
      }
      
      return { ...prev, x: newX };
    });
  }, [gameRunning, gameWidth]);

  const shoot = useCallback(() => {
    if (!gameRunning || bullets.length >= (powerUpActive ? 6 : 3)) return;
    
    const newBullet = {
      id: Math.random(),
      x: player.x + 18,
      y: player.y,
      speed: 8
    };
    
    setBullets(prev => [...prev, newBullet]);
  }, [gameRunning, bullets.length, player.x, player.y, powerUpActive]);

  const enemyShoot = useCallback(() => {
    if (invaders.length === 0 || Math.random() > 0.02) return;
    
    const frontInvaders = invaders.filter(invader => 
      !invaders.some(other => other.x === invader.x && other.y > invader.y)
    );
    
    if (frontInvaders.length > 0) {
      const shooter = frontInvaders[Math.floor(Math.random() * frontInvaders.length)];
      const newBullet = {
        id: Math.random(),
        x: shooter.x + 15,
        y: shooter.y + 25,
        speed: 4
      };
      
      setEnemyBullets(prev => [...prev, newBullet]);
    }
  }, [invaders]);

  const spawnPowerUp = useCallback(() => {
    if (Math.random() > 0.005 || powerUps.length > 0) return;
    
    const newPowerUp = {
      id: Math.random(),
      x: Math.random() * (gameWidth - 25),
      y: 0,
      speed: 2,
      type: 'rapidFire'
    };
    
    setPowerUps(prev => [...prev, newPowerUp]);
  }, [powerUps.length, gameWidth]);

  const gameLoop = useCallback(() => {
    if (!gameRunning || gameOver) return;

    // Move bullets
    setBullets(prev => prev.map(bullet => ({
      ...bullet,
      y: bullet.y - bullet.speed
    })).filter(bullet => bullet.y > 0));

    // Move enemy bullets
    setEnemyBullets(prev => prev.map(bullet => ({
      ...bullet,
      y: bullet.y + bullet.speed
    })).filter(bullet => bullet.y < gameHeight));

    // Move power-ups
    setPowerUps(prev => prev.map(powerUp => ({
      ...powerUp,
      y: powerUp.y + powerUp.speed
    })).filter(powerUp => powerUp.y < gameHeight));

    // Move invaders
    setInvaders(prev => {
      let shouldMoveDown = false;
      let newDirection = 1;
      
      // Check if any invader hits the edge
      prev.forEach(invader => {
        if (invader.x <= 0 || invader.x >= gameWidth - 30) {
          shouldMoveDown = true;
          newDirection = invader.x <= 0 ? 1 : -1;
        }
      });
      
      return prev.map(invader => ({
        ...invader,
        x: shouldMoveDown ? invader.x : invader.x + newDirection * 0.5,
        y: shouldMoveDown ? invader.y + 20 : invader.y
      }));
    });

    enemyShoot();
    spawnPowerUp();

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameRunning, gameOver, gameHeight, gameWidth, enemyShoot, spawnPowerUp]);

  // Collision detection
  useEffect(() => {
    if (!gameRunning) return;

    // Bullet vs Invader collision
    setBullets(prevBullets => {
      let newBullets = [...prevBullets];
      
      setInvaders(prevInvaders => {
        let newInvaders = [...prevInvaders];
        let scoreGained = 0;
        
        newBullets = newBullets.filter(bullet => {
          const hitInvader = newInvaders.findIndex(invader =>
            bullet.x >= invader.x && bullet.x <= invader.x + 30 &&
            bullet.y >= invader.y && bullet.y <= invader.y + 25
          );
          
          if (hitInvader !== -1) {
            newInvaders[hitInvader].health -= 1;
            if (newInvaders[hitInvader].health <= 0) {
              scoreGained += 10;
              newInvaders.splice(hitInvader, 1);
            }
            return false; // Remove bullet
          }
          return true;
        });
        
        if (scoreGained > 0) {
          const newScore = score + scoreGained;
          setScore(newScore);
          onScoreUpdate(newScore);
        }
        
        return newInvaders;
      });
      
      return newBullets;
    });

    // Enemy bullet vs Player collision
    setEnemyBullets(prevBullets => {
      const hitPlayer = prevBullets.some(bullet =>
        bullet.x >= player.x && bullet.x <= player.x + 40 &&
        bullet.y >= player.y && bullet.y <= player.y + 30
      );
      
      if (hitPlayer) {
        setLives(prev => prev - 1);
        return prevBullets.filter(bullet =>
          !(bullet.x >= player.x && bullet.x <= player.x + 40 &&
            bullet.y >= player.y && bullet.y <= player.y + 30)
        );
      }
      
      return prevBullets;
    });

    // Power-up vs Player collision
    setPowerUps(prevPowerUps => {
      const collectedPowerUp = prevPowerUps.find(powerUp =>
        powerUp.x >= player.x - 10 && powerUp.x <= player.x + 30 &&
        powerUp.y >= player.y - 10 && powerUp.y <= player.y + 20
      );
      
      if (collectedPowerUp) {
        setPowerUpActive(true);
        setTimeout(() => setPowerUpActive(false), 5000);
        return prevPowerUps.filter(powerUp => powerUp.id !== collectedPowerUp.id);
      }
      
      return prevPowerUps;
    });

    // Check win condition
    if (invaders.length === 0) {
      const nextWave = wave + 1;
      setWave(nextWave);
      setInvaders(createInvaderGrid(nextWave));
      
      if (nextWave > 5) {
        setWon(true);
        setGameOver(true);
        setGameRunning(false);
        onGameEnd(score);
      }
    }

    // Check lose condition
    if (lives <= 0) {
      setGameOver(true);
      setGameRunning(false);
      onGameEnd(score);
    }

    // Check if invaders reached player
    const invasionReached = invaders.some(invader => invader.y >= gameHeight - 100);
    if (invasionReached) {
      setGameOver(true);
      setGameRunning(false);
      onGameEnd(score);
    }
  }, [bullets, enemyBullets, invaders, player, lives, wave, score, onScoreUpdate, onGameEnd, gameRunning, createInvaderGrid, gameHeight]);

  // Game loop
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

  // Controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysRef.current[e.key] = true;
      
      if (e.key === ' ') {
        e.preventDefault();
        shoot();
      }
    };

    const handleKeyUp = (e) => {
      keysRef.current[e.key] = false;
    };

    const handleMovement = () => {
      if (keysRef.current['ArrowLeft'] || keysRef.current['a']) {
        movePlayer('left');
      }
      if (keysRef.current['ArrowRight'] || keysRef.current['d']) {
        movePlayer('right');
      }
    };

    const movementInterval = setInterval(handleMovement, 16);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearInterval(movementInterval);
    };
  }, [movePlayer, shoot]);

  const startGame = () => {
    setGameRunning(true);
    setGameOver(false);
    setWon(false);
    setInvaders(createInvaderGrid(1));
  };

  const resetGame = () => {
    setPlayer({ x: gameWidth / 2 - 20, y: gameHeight - 50 });
    setInvaders([]);
    setBullets([]);
    setEnemyBullets([]);
    setPowerUps([]);
    setScore(0);
    setLives(3);
    setWave(1);
    setGameRunning(false);
    setGameOver(false);
    setWon(false);
    setPowerUpActive(false);
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
          <StatValue>{wave}</StatValue>
          <StatLabel>Wave</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{invaders.length}</StatValue>
          <StatLabel>Invaders</StatLabel>
        </StatItem>
      </StatsContainer>

      <GameArea style={{ width: gameWidth, height: gameHeight }}>
        <UI>
          <div>Score: {score}</div>
          <div>Wave: {wave}</div>
          <Lives>
            {Array.from({ length: lives }, (_, i) => (
              <Heart key={i}>❤️</Heart>
            ))}
          </Lives>
        </UI>

        {powerUpActive && (
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ffd93d',
            fontWeight: 'bold',
            textShadow: '0 0 10px #ffd93d'
          }}>
            ⚡ RAPID FIRE ACTIVE! ⚡
          </div>
        )}

        <Player
          style={{
            left: player.x,
            top: player.y
          }}
        />

        {invaders.map(invader => (
          <Invader
            key={invader.id}
            style={{
              left: invader.x,
              top: invader.y,
              opacity: invader.health === 1 ? 1 : 0.7,
              border: invader.health > 1 ? '2px solid #ffd93d' : '1px solid #fff'
            }}
          />
        ))}

        {bullets.map(bullet => (
          <Bullet
            key={bullet.id}
            style={{
              left: bullet.x,
              top: bullet.y
            }}
          />
        ))}

        {enemyBullets.map(bullet => (
          <Bullet
            key={bullet.id}
            enemy
            style={{
              left: bullet.x,
              top: bullet.y
            }}
          />
        ))}

        {powerUps.map(powerUp => (
          <PowerUp
            key={powerUp.id}
            style={{
              left: powerUp.x,
              top: powerUp.y
            }}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
        ))}

        <AnimatePresence>
          {gameOver && (
            <GameOverOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <GameOverTitle won={won}>
                {won ? 'Victory!' : 'Game Over!'}
              </GameOverTitle>
              <GameOverScore>Score: {score}</GameOverScore>
              <GameOverScore>Waves Completed: {won ? wave : wave - 1}</GameOverScore>
              <GameOverScore>
                {won ? 'Earth is saved!' : 
                 score < 50 ? 'Try again, defender!' :
                 score < 200 ? 'Good effort!' :
                 score < 500 ? 'Great job!' :
                 'Outstanding defense!'}
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
          ⌨️ Arrow keys or A/D to move • Space to shoot • Collect ⭐ for power-ups!
        </ControlText>
        
        <div>
          {!gameRunning && (
            <ActionButton
              onClick={startGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Game
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
          onTouchStart={() => movePlayer('left')}
          whileTap={{ scale: 0.9 }}
        >
          ← Move
        </TouchButton>
        <TouchButton
          onTouchStart={shoot}
          whileTap={{ scale: 0.9 }}
        >
          🚀 Shoot
        </TouchButton>
        <TouchButton
          onTouchStart={() => movePlayer('right')}
          whileTap={{ scale: 0.9 }}
        >
          Move →
        </TouchButton>
      </TouchControls>
    </GameContainer>
  );
}

export default SpaceInvadersGame;
