import React, {
    createContext, useContext, useState,
    useEffect, useCallback, useMemo,
} from 'react';
import type {
    AppView, FactId, Clue, RuneId,
    ForumLayer, SaveData, GameContextType,
} from '@/types';

// ═══════════════════════════════════════════════════════
//  ZhenSuo V4 · GameStore — 全局状态管理
//  FactId 驱动进度 · 防穿越前置条件 · 自动持久化
// ═══════════════════════════════════════════════════════

const STORAGE_KEY = 'zhensuo_save_v4';

const defaultSave: SaveData = {
    version: 4,
    currentView: 'warning',
    facts: [],
    clues: [],
    collectedRunes: [],
    completedEndings: [],
    forumLayer: 0,
    isOALoggedIn: false,
    timestamp: Date.now(),
};

function loadSave(): SaveData {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { ...defaultSave };
        const parsed = JSON.parse(raw) as SaveData;
        if (parsed.version !== 4) return { ...defaultSave };
        return parsed;
    } catch {
        return { ...defaultSave };
    }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
    const [save, setSave] = useState<SaveData>(loadSave);

    // ── 持久化 ──
    useEffect(() => {
        const data: SaveData = { ...save, timestamp: Date.now() };
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }
        catch { /* ignore quota errors */ }
    }, [save]);

    // ── 视图 ──
    const setView = useCallback((view: AppView) => {
        setSave(prev => ({ ...prev, currentView: view }));
    }, []);

    // ── 事实系统 ──
    const addFact = useCallback((id: FactId) => {
        setSave(prev => {
            if (prev.facts.includes(id)) return prev;
            return { ...prev, facts: [...prev.facts, id] };
        });
    }, []);

    const hasFact = useCallback((id: FactId) => {
        return save.facts.includes(id);
    }, [save.facts]);

    // ── 线索 ──
    const addClue = useCallback((clue: Clue) => {
        setSave(prev => {
            if (prev.clues.some(c => c.id === clue.id)) return prev;
            return { ...prev, clues: [...prev.clues, { ...clue, discoveredAt: Date.now() }] };
        });
    }, []);

    const hasClue = useCallback((id: string) => {
        return save.clues.some(c => c.id === id);
    }, [save.clues]);

    // ── 碎片 ──
    const collectRune = useCallback((id: RuneId) => {
        setSave(prev => {
            if (prev.collectedRunes.includes(id)) return prev;
            return { ...prev, collectedRunes: [...prev.collectedRunes, id] };
        });
    }, []);

    const hasRune = useCallback((id: RuneId) => {
        return save.collectedRunes.includes(id);
    }, [save.collectedRunes]);

    const runeCount = save.collectedRunes.length;
    const linXiaoSignalStrength = runeCount; // 0-7

    // ── 论坛 ──
    const setForumLayer = useCallback((layer: ForumLayer) => {
        setSave(prev => ({ ...prev, forumLayer: Math.max(prev.forumLayer, layer) as ForumLayer }));
    }, []);

    // ── OA ──
    const setOALoggedIn = useCallback((v: boolean) => {
        setSave(prev => ({ ...prev, isOALoggedIn: v }));
    }, []);

    // ── 结局 ──
    const completeEnding = useCallback((id: string) => {
        setSave(prev => {
            if (prev.completedEndings.includes(id)) return prev;
            return { ...prev, completedEndings: [...prev.completedEndings, id] };
        });
    }, []);

    // ── 重置 ──
    const resetGame = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setSave({ ...defaultSave, timestamp: Date.now() });
    }, []);

    // ── Context value ──
    const value = useMemo<GameContextType>(() => ({
        currentView: save.currentView,
        setView,
        facts: save.facts,
        addFact,
        hasFact,
        clues: save.clues,
        addClue,
        hasClue,
        collectedRunes: save.collectedRunes,
        collectRune,
        hasRune,
        runeCount,
        linXiaoSignalStrength,
        forumLayer: save.forumLayer,
        setForumLayer,
        isOALoggedIn: save.isOALoggedIn,
        setOALoggedIn,
        completedEndings: save.completedEndings,
        completeEnding,
        resetGame,
    }), [
        save, setView, addFact, hasFact, addClue, hasClue,
        collectRune, hasRune, runeCount, linXiaoSignalStrength,
        setForumLayer, setOALoggedIn, completeEnding, resetGame,
    ]);

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
}

export function useGame(): GameContextType {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error('useGame must be used within <GameProvider>');
    return ctx;
}
