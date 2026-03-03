import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { GameContextType, AppState, GamePhase, Clue, EndingType, RuneId } from './types';

// ═══════════════════════════════════════════
//  存档系统
// ═══════════════════════════════════════════
const STORAGE_KEY = 'zhensuo-save-v3';

interface SaveData {
  currentApp: AppState;
  gentleMode: boolean;
  clues: Clue[];
  endingType: EndingType;
  // V3 新增
  readHooks: string[];
  currentPhase: GamePhase;
  collectedRunes: RuneId[];
  isOALoggedIn: boolean;
  completedEndings: string[];
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
    // localStorage 满或不可用，静默忽略
  }
}

// ═══════════════════════════════════════════
//  Context 创建
// ═══════════════════════════════════════════
const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const saved = loadSave();

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

  // ── V3 进度锁 ──
  const readHook = (hookId: string) => {
    setReadHooks(prev => {
      if (prev.includes(hookId)) return prev;
      return [...prev, hookId];
    });
  };
  const hasReadHook = (hookId: string) => readHooks.includes(hookId);

  // ── V3 阶段推进 ──
  const advancePhase = () => {
    setCurrentPhase(prev => (prev < 4 ? (prev + 1) as GamePhase : prev));
  };

  // ── V3 符文碎片 ──
  const collectRune = (runeId: RuneId) => {
    setCollectedRunes(prev => {
      if (prev.includes(runeId)) return prev;
      setHasUnread(true);
      return [...prev, runeId];
    });
  };
  const hasRune = (runeId: RuneId) => collectedRunes.includes(runeId);

  // ── V3 OA 登录拦截 ──
  // 必须先读过3.14声明中的8023工号 + 信息安全条款密码规则
  const canLoginOA = () => {
    return readHooks.includes('news_8023') && readHooks.includes('news_password_rule');
  };

  // ── 结局回溯 ──
  const completeEnding = (endingId: string) => {
    setCompletedEndings(prev => {
      if (prev.includes(endingId)) return prev;
      return [...prev, endingId];
    });
  };

  // ── 重置 ──
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
    setOALoggedIn(false);
    setCompletedEndings([]);
  }, []);

  return (
    <GameContext.Provider value={{
      currentApp, setCurrentApp,
      gentleMode, setGentleMode,
      clues, addClue, hasClue, hasUnread, markAsRead,
      readHooks, readHook, hasReadHook,
      currentPhase, advancePhase,
      collectedRunes, collectRune, hasRune, linXiaoSignalStrength,
      isOALoggedIn, setOALoggedIn, canLoginOA,
      endingType, setEndingType,
      completedEndings, completeEnding,
      resetGame,
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
