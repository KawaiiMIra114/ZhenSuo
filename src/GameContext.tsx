import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GameContextType, AppState, Clue, EndingType } from './types';

const STORAGE_KEY = 'zhensuo-save';

interface SaveData {
  currentApp: AppState;
  gentleMode: boolean;
  clues: Clue[];
  fragments: number[];
  endingType: EndingType;
}

function loadSave(): SaveData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SaveData;
  } catch {
    return null;
  }
}

function writeSave(data: SaveData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // localStorage 可能满或不可用，静默忽略
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const saved = loadSave();

  const [currentApp, setCurrentAppState] = useState<AppState>(saved?.currentApp ?? 'warning');
  const [gentleMode, setGentleMode] = useState(saved?.gentleMode ?? false);
  const [clues, setClues] = useState<Clue[]>(saved?.clues ?? []);
  const [fragments, setFragments] = useState<number[]>(saved?.fragments ?? []);
  const [hasUnread, setHasUnread] = useState(false);
  const [endingType, setEndingType] = useState<EndingType>(saved?.endingType ?? null);

  // 包装 setCurrentApp 以同步存档
  const setCurrentApp = useCallback((app: AppState) => {
    setCurrentAppState(app);
  }, []);

  // 每当关键状态变化时自动保存
  useEffect(() => {
    writeSave({ currentApp, gentleMode, clues, fragments, endingType });
  }, [currentApp, gentleMode, clues, fragments, endingType]);

  // 导航
  const [currentApp, setCurrentAppState] = useState<AppState>(saved?.currentApp ?? 'warning');
  const [gentleMode, setGentleMode] = useState(saved?.gentleMode ?? false);

  // 线索系统
  const [clues, setClues] = useState<Clue[]>(saved?.clues ?? []);
  const [hasUnread, setHasUnread] = useState(false);

  // 结局
  const [endingType, setEndingType] = useState<EndingType>(saved?.endingType ?? null);
  const [completedEndings, setCompletedEndings] = useState<string[]>(saved?.completedEndings ?? []);

  // V3 进度锁
  const [readHooks, setReadHooks] = useState<string[]>(saved?.readHooks ?? []);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>(saved?.currentPhase ?? 1);
  const [collectedRunes, setCollectedRunes] = useState<RuneId[]>(saved?.collectedRunes ?? []);
  const [isOALoggedIn, setOALoggedIn] = useState(saved?.isOALoggedIn ?? false);

  // 林晓信号强度 = 碎片数
  const linXiaoSignalStrength = collectedRunes.length;

  // 包装 setCurrentApp
  const setCurrentApp = useCallback((app: AppState) => {
    setCurrentAppState(app);
  }, []);

  // 自动存档
  useEffect(() => {
    writeSave({
      currentApp, gentleMode, clues, endingType,
      readHooks, currentPhase, collectedRunes, isOALoggedIn, completedEndings,
    });
  }, [currentApp, gentleMode, clues, endingType, readHooks, currentPhase, collectedRunes, isOALoggedIn, completedEndings]);

  // ── 线索 ──
  const addClue = (clue: Clue) => {
    setClues(prev => {
      if (prev.some(c => c.id === clue.id)) return prev;
      setHasUnread(true);
      return [...prev, clue];
    });
  };
  const hasClue = (id: string) => clues.some(c => c.id === id);
  const markAsRead = () => setHasUnread(false);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentAppState('warning');
    setGentleMode(false);
    setClues([]);
    setFragments([]);
    setHasUnread(false);
    setEndingType(null);
  }, []);

  return (
    <GameContext.Provider value={{ currentApp, setCurrentApp, gentleMode, setGentleMode, clues, addClue, fragments, addFragment, hasClue, hasUnread, markAsRead, endingType, setEndingType, resetGame }}>
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
