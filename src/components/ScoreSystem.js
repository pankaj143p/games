import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Trophy, Zap } from 'lucide-react';

const ScoreContainer = styled(motion.div)`
  position: absolute;
  top: 80px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 15px 20px;
  color: white;
  min-width: 150px;
  z-index: 100;
  
  @media (max-width: 768px) {
    top: 80px;
    right: 10px;
    left: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
  }
`;

const ScoreItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 0;
    flex-direction: column;
    gap: 2px;
  }
`;

const ScoreLabel = styled.span`
  font-size: 0.8rem;
  opacity: 0.8;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const ScoreValue = styled.span`
  font-size: 1.1rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const GameName = styled.div`
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 10px;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

function ScoreSystem({ currentScore, highScore, gameName }) {
  return (
    <ScoreContainer
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <GameName>{gameName}</GameName>
      
      <ScoreItem>
        <Zap size={16} />
        <div>
          <ScoreLabel>Score</ScoreLabel>
          <br />
          <ScoreValue>{currentScore.toLocaleString()}</ScoreValue>
        </div>
      </ScoreItem>
      
      <ScoreItem>
        <Trophy size={16} />
        <div>
          <ScoreLabel>Best</ScoreLabel>
          <br />
          <ScoreValue>{highScore.toLocaleString()}</ScoreValue>
        </div>
      </ScoreItem>
    </ScoreContainer>
  );
}

export default ScoreSystem;
