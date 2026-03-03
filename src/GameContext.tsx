import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameContextType, AppState, Clue, EndingType } from './types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentApp, setCurrentApp] = useState<AppState>('warning');
  const [gentleMode, setGentleMode] = useState(false);
  const [clues, setClues] = useState<Clue[]>([]);
  const [fragments, setFragments] = useState<number[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [endingType, setEndingType] = useState<EndingType>(null);

  const addClue = (clue: Clue) => {
    setClues(prev => {
      if (prev.some(c => c.id === clue.id)) return prev;
      setHasUnread(true);
      return [...prev, clue];
    });
  };

  const addFragment = (id: number) => {
    setFragments(prev => {
      if (prev.includes(id)) return prev;
      setHasUnread(true);
      return [...prev, id];
    });
  };

  const hasClue = (id: string) => clues.some(c => c.id === id);
  const markAsRead = () => setHasUnread(false);

  return (
    <GameContext.Provider value={{ currentApp, setCurrentApp, gentleMode, setGentleMode, clues, addClue, fragments, addFragment, hasClue, hasUnread, markAsRead, endingType, setEndingType }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
