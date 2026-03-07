import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  AppState,
  Clue,
  GameContextType,
  EndingType,
  GamePhase,
  RuneId,
  ForumAccess,
} from './types';

const STORAGE_KEY = 'zhensuo_save_v3';

// 持久化存档
export interface SaveData {
  currentApp: AppState;
  openWindows: string[];
  gentleMode: boolean;
  clues: Clue[];
  endingType: EndingType;
  readHooks: string[];
  currentPhase: GamePhase;
  collectedRunes: RuneId[];
  isOALoggedIn: boolean;
  completedEndings: string[];
  forumAccess: ForumAccess;       // V4
  discoveredFacts: string[];      // V4
  signalBoost: number;            // V4 额外信号增量
  playTimeSeconds: number;        // V5 游玩时长
  erasureActive: boolean;         // V5 痕迹抹除状态
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
  const [openWindows, setOpenWindowsState] = useState<string[]>(saved?.openWindows ?? ['wechat', 'email', 'photos']);
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

  // V4 论坛层级
  const [forumAccess, setForumAccessState] = useState<ForumAccess>(saved?.forumAccess ?? 'public');

  // V4 防穿越前置条件
  const [discoveredFacts, setDiscoveredFacts] = useState<string[]>(saved?.discoveredFacts ?? []);

  // V4 林晓信号额外增量
  const [signalBoost, setSignalBoost] = useState(saved?.signalBoost ?? 0);
  const [playTimeSeconds, setPlayTimeSeconds] = useState(saved?.playTimeSeconds ?? 0);
  const [erasureActive, setErasureActiveState] = useState(saved?.erasureActive ?? false);

  // 包装 setCurrentApp
  const setCurrentApp = useCallback((app: AppState) => {
    setCurrentAppState(app);
  }, []);
  const setErasureActive = useCallback((v: boolean) => {
    setErasureActiveState(v);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlayTimeSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 自动存档
  useEffect(() => {
    writeSave({
      currentApp,
      openWindows,
      gentleMode,
      clues,
      endingType,
      readHooks,
      currentPhase,
      collectedRunes,
      isOALoggedIn,
      completedEndings,
      forumAccess,
      discoveredFacts,
      signalBoost,
      playTimeSeconds,
      erasureActive,
    });
  }, [
    currentApp, openWindows, gentleMode, clues, endingType,
    readHooks, currentPhase, collectedRunes, isOALoggedIn, completedEndings,
    forumAccess, discoveredFacts, signalBoost, playTimeSeconds, erasureActive,
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

  // 林晓信号强度上限为 7（避免继续叠加导致表现失控）
  const linXiaoSignalStrength = Math.min(collectedRunes.length + signalBoost, 7);
  const boostSignal = useCallback(() => {
    setSignalBoost(prev => Math.min(prev + 1, 7));
  }, []);

  // OA 系统 — V4 防穿越
  const setOALoggedIn = useCallback((v: boolean) => setOALoggedInState(v), []);
  const canLoginOA = useCallback(() => {
    // V4 防穿越：必须已发现 OA URL + 已知工号 8023
    return discoveredFacts.includes('oa_url_discovered')
      && discoveredFacts.includes('employee_8023_known');
  }, [discoveredFacts]);

  // V4 论坛层级
  const setForumAccess = useCallback((access: ForumAccess) => {
    setForumAccessState(access);
  }, []);

  // V4 防穿越前置条件
  const addFact = useCallback((factId: string) => {
    setDiscoveredFacts(prev => {
      if (prev.includes(factId)) return prev;
      return [...prev, factId];
    });
  }, []);
  const hasFact = useCallback((factId: string) => discoveredFacts.includes(factId), [discoveredFacts]);

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
    // 兼容历史版本存档键，避免“重置后仍读到旧进度”
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith('zhensuo_save_')) {
        localStorage.removeItem(k);
      }
    });
    setCurrentAppState('warning');
    setOpenWindowsState(['wechat', 'email', 'photos']);
    setGentleMode(false);
    setClues([]);
    setHasUnread(false);
    setEndingType(null);
    setReadHooks([]);
    setCurrentPhase(1);
    setCollectedRunes([]);
    setOALoggedInState(false);
    setCompletedEndings([]);
    setForumAccessState('public');
    setDiscoveredFacts([]);
    setSignalBoost(0);
    setPlayTimeSeconds(0);
    setErasureActiveState(false);
  }, []);

  return (
    <GameContext.Provider value={{
      // 导航
      currentApp, setCurrentApp,
      openWindows, setOpenWindows: setOpenWindowsState,
      gentleMode, setGentleMode,

      // 线索
      clues, addClue, hasClue,
      hasUnread, markAsRead,

      // Hook
      readHooks, readHook, hasReadHook,

      // 阶段
      currentPhase, advancePhase,

      // 符文
      collectedRunes, collectRune, hasRune, linXiaoSignalStrength, boostSignal,

      // OA
      isOALoggedIn, setOALoggedIn, canLoginOA,

      // 结局
      endingType, setEndingType,
      completedEndings, completeEnding,
      playTimeSeconds,
      erasureActive, setErasureActive,

      // V4 论坛层级
      forumAccess, setForumAccess,

      // V4 防穿越
      discoveredFacts, addFact, hasFact,

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
