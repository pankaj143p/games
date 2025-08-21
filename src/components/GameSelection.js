import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, Target, Zap, Users } from 'lucide-react';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const GameCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(-2px);
  }
`;

const GameIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  
  svg {
    color: white;
    width: 30px;
    height: 30px;
  }
`;

const GameTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
`;

const GameDescription = styled.p`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
  margin-bottom: 15px;
`;

const GameFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Feature = styled.span`
  background: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const StatsSection = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 30px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
  max-width: 600px;
  width: 100%;
`;

const StatItem = styled.div`
  text-align: center;
  color: white;
`;

const StatValue = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const games = [
  {
    id: '2048',
    title: '2048',
    description: 'Slide numbered tiles to combine them and reach 2048. Simple concept, addictive gameplay.',
    icon: Target,
    features: ['Touch Controls', 'Progressive Difficulty', 'High Score Tracking'],
    gradient: 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic arcade game with modern touch controls. Eat food, grow longer, avoid walls.',
    icon: Zap,
    features: ['Swipe Controls', 'Growing Difficulty', 'Retro Vibes'],
    gradient: 'linear-gradient(135deg, #4ecdc4, #44a08d)'
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'The legendary puzzle game. Stack falling blocks to clear lines and score points.',
    icon: Gamepad2,
    features: ['Touch & Drag', 'Line Clearing', 'Speed Increase'],
    gradient: 'linear-gradient(135deg, #a8e6cf, #7fcdcd)'
  },
  {
    id: 'flappy',
    title: 'Flappy Bird',
    description: 'Tap to fly through pipes. Simple one-touch gameplay with endless challenge.',
    icon: Users,
    features: ['One-Touch Control', 'Endless Runner', 'Pixel Perfect'],
    gradient: 'linear-gradient(135deg, #ffd93d, #ff6b6b)'
  },
  {
    id: 'invaders',
    title: 'Space Invaders',
    description: 'Defend Earth from alien invasion. Touch to move and shoot in this classic arcade game.',
    icon: Trophy,
    features: ['Touch Controls', 'Power-ups', 'Wave Progression'],
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
  }
];

function GameSelection({ onSelectGame, highScore, gameStats }) {
  return (
    <Container>
      <Header>
        <Title
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          DDGaming Scrolly
        </Title>
        <Subtitle
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Premium Mobile Gaming Experience
        </Subtitle>
      </Header>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <StatsSection>
          <StatItem>
            <StatValue>{highScore.toLocaleString()}</StatValue>
            <StatLabel>High Score</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{gameStats.gamesPlayed}</StatValue>
            <StatLabel>Games Played</StatLabel>
          </StatItem>
          <StatItem>
            <StatValue>{gameStats.averageScore}</StatValue>
            <StatLabel>Avg Score</StatLabel>
          </StatItem>
        </StatsSection>
      </motion.div>

      <GamesGrid>
        {games.map((game, index) => (
          <GameCard
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <GameIcon style={{ background: game.gradient }}>
              <game.icon />
            </GameIcon>
            <GameTitle>{game.title}</GameTitle>
            <GameDescription>{game.description}</GameDescription>
            <GameFeatures>
              {game.features.map((feature, idx) => (
                <Feature key={idx}>{feature}</Feature>
              ))}
            </GameFeatures>
          </GameCard>
        ))}
      </GamesGrid>
    </Container>
  );
}

export default GameSelection;
