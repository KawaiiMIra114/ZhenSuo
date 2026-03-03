import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppState,
  Clue,
  GameContextType,
  EndingType,
  GamePhase,
  RuneId
} from './types';

const STORAGE_KEY = 'zhensuo_save_v3';

// 移除与持久化无关的非状态内容，仅保留要在 localStorage 里存取的
export interface SaveData {
  currentApp: AppState;
  gentleMode: boolean;
  clues: Clue[];
  endingType: EndingType;
  readHooks: string[];
  currentPhase: GamePhase;
  collectedRunes: RuneId[];
  isOALoggedIn: boolean;
  completedEndings: string[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [saved] = useState<SaveData | null>(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });

  const writeSave = useCallback((data: SaveData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, []);

  // 导航
  const [currentApp, setCurrentAppState] = useState<AppState>(saved?.currentApp ?? 'warning');
  const [gentleMode, setGentleMode] = useState(saved?.gentleMode ?? false);

  // 线索系统
  const [clues, setClues] = useState<Clue[]>(saved?.clues ?? []);
  const [hasUnread, setHasUnread] = useState(false);

  // 结局
  const [endingType, setEndingType] = useState<EndingType>(saved?.endingType ?? null);
  const [completedEndings, setCompletedEndings] = useState<string[]>(saved?.completedEndings ?? []);

  // V3 进度锁系统 (§4.1)
  const [readHooks, setReadHooks] = useState<string[]>(saved?.readHooks ?? []);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>(saved?.currentPhase ?? 1);
  const [collectedRunes, setCollectedRunes] = useState<RuneId[]>(saved?.collectedRunes ?? []);
  const [isOALoggedIn, setOALoggedInState] = useState(saved?.isOALoggedIn ?? false);

  // 包装 setCurrentApp
  const setCurrentApp = useCallback((app: AppState) => {
    setCurrentAppState(app);
  }, []);

  // 自动存档
  useEffect(() => {
    writeSave({
      currentApp,
      gentleMode,
      clues,
      endingType,
      readHooks,
      currentPhase,
      collectedRunes,
      isOALoggedIn,
      completedEndings,
    });
  }, [
    currentApp, gentleMode, clues, endingType,
    readHooks, currentPhase, collectedRunes, isOALoggedIn, completedEndings,
    writeSave
  ]);

  // ── 线索 ──
  const addClue = useCallback((clue: Clue) => {
    setClues(prev => {
      if (prev.some(c => c.id === clue.id)) return prev;
      setHasUnread(true);
      return [...prev, clue];
    });
  }, []);

  const hasClue = useCallback((id: string) => clues.some(c => c.id === id), [clues]);
  const markAsRead = useCallback(() => setHasUnread(false), []);

  // ── V3 核心机制 ──

  // Hook 系统 (阅读进度锁)
  const readHook = useCallback((hookId: string) => {
    setReadHooks(prev => {
      if (prev.includes(hookId)) return prev;
      return [...prev, hookId];
    });
  }, []);
  const hasReadHook = useCallback((hookId: string) => readHooks.includes(hookId), [readHooks]);

  // 阶段推进
  const advancePhase = useCallback(() => {
    setCurrentPhase(prev => (prev < 4 ? (prev + 1) as GamePhase : 4));
  }, []);

  // 符文收集
  const collectRune = useCallback((runeId: RuneId) => {
    setCollectedRunes(prev => {
      if (prev.includes(runeId)) return prev;
      return [...prev, runeId];
    });
  }, []);
  const hasRune = useCallback((runeId: RuneId) => collectedRunes.includes(runeId), [collectedRunes]);

  // 林晓信号强度
  const linXiaoSignalStrength = collectedRunes.length;

  // OA 系统
  const setOALoggedIn = useCallback((v: boolean) => setOALoggedInState(v), []);
  const canLoginOA = useCallback(() => {
    // 根据 V3 §C，通过所有线索的获取和阅读来判断是否能进入 OA
    return hasReadHook('fswltz') && hasClue('clue_purchase_order');
  }, [hasReadHook, hasClue]);

  // 结局收集
  const completeEnding = useCallback((endingId: string) => {
    setCompletedEndings(prev => {
      if (prev.includes(endingId)) return prev;
      return [...prev, endingId];
    });
  }, []);

  // 重置游戏
  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentAppState('warning');
    setGentleMode(false);
    setClues([]);
    setHasUnread(false);
    setEndingType(null);
    setReadHooks([]);
    setCurrentPhase(1);
    setCollectedRunes([]);
    setOALoggedInState(false);
    setCompletedEndings([]);
  }, []);

  return (
    <GameContext.Provider value={{
      // 导航
      currentApp, setCurrentApp,
      gentleMode, setGentleMode,

      // 线索
      clues, addClue, hasClue,
      hasUnread, markAsRead,

      // Hook
      readHooks, readHook, hasReadHook,

      // 阶段
      currentPhase, advancePhase,

      // 符文
      collectedRunes, collectRune, hasRune, linXiaoSignalStrength,

      // OA
      isOALoggedIn, setOALoggedIn, canLoginOA,

      // 结局
      endingType, setEndingType,
      completedEndings, completeEnding,

      // 系统
      resetGame
    }}>
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
