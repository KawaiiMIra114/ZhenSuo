import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useReducer,
  type PropsWithChildren
} from 'react';
import type { FactId, GameState, RuneId, SerializableState } from './types';

const STORAGE_KEY = 'zhen-suo-v4-state';

const initialState: GameState = {
  currentPhase: 0,
  readNodes: new Set(),
  forumAccess: 'public',
  oaLoggedIn: false,
  collectedRunes: new Set(),
  linXiaoSignalStrength: 0,
  discoveredFacts: new Set(),
  adminUnlocked: false,
  shadowArchiveAccessed: false,
  zhaoQiEmailShown: false,
  endingChosen: null
};

type Action =
  | { type: 'DISCOVER_FACT'; fact: FactId }
  | { type: 'COLLECT_RUNE'; rune: RuneId }
  | { type: 'READ_NODE'; nodeId: string }
  | { type: 'SET_FORUM_ACCESS'; access: GameState['forumAccess'] }
  | { type: 'SET_OA_LOGGED_IN'; value: boolean }
  | { type: 'SET_ADMIN_UNLOCKED'; value: boolean }
  | { type: 'SET_SHADOW_ACCESSED'; value: boolean }
  | { type: 'SET_PHASE'; value: GameState['currentPhase'] }
  | { type: 'SET_ENDING'; value: GameState['endingChosen'] }
  | { type: 'SET_ZHAOQI_EMAIL_SHOWN'; value: boolean }
  | { type: 'INCREASE_SIGNAL' }
  | { type: 'RESET' };

function serialize(state: GameState): SerializableState {
  return {
    currentPhase: state.currentPhase,
    readNodes: [...state.readNodes],
    forumAccess: state.forumAccess,
    oaLoggedIn: state.oaLoggedIn,
    collectedRunes: [...state.collectedRunes],
    linXiaoSignalStrength: state.linXiaoSignalStrength,
    discoveredFacts: [...state.discoveredFacts],
    adminUnlocked: state.adminUnlocked,
    shadowArchiveAccessed: state.shadowArchiveAccessed,
    zhaoQiEmailShown: state.zhaoQiEmailShown,
    endingChosen: state.endingChosen
  };
}

function hydrate(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as SerializableState;
    return {
      currentPhase: parsed.currentPhase,
      readNodes: new Set(parsed.readNodes),
      forumAccess: parsed.forumAccess,
      oaLoggedIn: parsed.oaLoggedIn,
      collectedRunes: new Set(parsed.collectedRunes),
      linXiaoSignalStrength: parsed.linXiaoSignalStrength,
      discoveredFacts: new Set(parsed.discoveredFacts),
      adminUnlocked: parsed.adminUnlocked,
      shadowArchiveAccessed: parsed.shadowArchiveAccessed,
      zhaoQiEmailShown: parsed.zhaoQiEmailShown,
      endingChosen: parsed.endingChosen
    };
  } catch {
    return initialState;
  }
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'DISCOVER_FACT': {
      if (state.discoveredFacts.has(action.fact)) return state;
      const discoveredFacts = new Set(state.discoveredFacts);
      discoveredFacts.add(action.fact);
      return { ...state, discoveredFacts };
    }
    case 'COLLECT_RUNE': {
      if (state.collectedRunes.has(action.rune)) return state;
      const collectedRunes = new Set(state.collectedRunes);
      collectedRunes.add(action.rune);
      return {
        ...state,
        collectedRunes,
        linXiaoSignalStrength: Math.max(
          state.linXiaoSignalStrength,
          Math.min(7, collectedRunes.size)
        )
      };
    }
    case 'READ_NODE': {
      if (state.readNodes.has(action.nodeId)) return state;
      const readNodes = new Set(state.readNodes);
      readNodes.add(action.nodeId);
      return { ...state, readNodes };
    }
    case 'SET_FORUM_ACCESS':
      return { ...state, forumAccess: action.access };
    case 'SET_OA_LOGGED_IN':
      return { ...state, oaLoggedIn: action.value };
    case 'SET_ADMIN_UNLOCKED':
      return { ...state, adminUnlocked: action.value };
    case 'SET_SHADOW_ACCESSED':
      return { ...state, shadowArchiveAccessed: action.value };
    case 'SET_PHASE':
      return { ...state, currentPhase: action.value };
    case 'SET_ENDING':
      return { ...state, endingChosen: action.value };
    case 'SET_ZHAOQI_EMAIL_SHOWN':
      return { ...state, zhaoQiEmailShown: action.value };
    case 'INCREASE_SIGNAL':
      return {
        ...state,
        linXiaoSignalStrength: Math.min(7, state.linXiaoSignalStrength + 1)
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface GameContextValue {
  state: GameState;
  discoverFact: (fact: FactId) => void;
  collectRune: (rune: RuneId) => void;
  readNode: (nodeId: string) => void;
  setForumAccess: (access: GameState['forumAccess']) => void;
  setOaLoggedIn: (value: boolean) => void;
  setAdminUnlocked: (value: boolean) => void;
  setShadowAccessed: (value: boolean) => void;
  setPhase: (value: GameState['currentPhase']) => void;
  setEnding: (value: GameState['endingChosen']) => void;
  setZhaoQiEmailShown: (value: boolean) => void;
  increaseSignal: () => void;
  reset: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, undefined, hydrate);

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      discoverFact: (fact) => dispatch({ type: 'DISCOVER_FACT', fact }),
      collectRune: (rune) => dispatch({ type: 'COLLECT_RUNE', rune }),
      readNode: (nodeId) => dispatch({ type: 'READ_NODE', nodeId }),
      setForumAccess: (access) => dispatch({ type: 'SET_FORUM_ACCESS', access }),
      setOaLoggedIn: (val) => dispatch({ type: 'SET_OA_LOGGED_IN', value: val }),
      setAdminUnlocked: (val) => dispatch({ type: 'SET_ADMIN_UNLOCKED', value: val }),
      setShadowAccessed: (val) => dispatch({ type: 'SET_SHADOW_ACCESSED', value: val }),
      setPhase: (val) => dispatch({ type: 'SET_PHASE', value: val }),
      setEnding: (val) => dispatch({ type: 'SET_ENDING', value: val }),
      setZhaoQiEmailShown: (val) =>
        dispatch({ type: 'SET_ZHAOQI_EMAIL_SHOWN', value: val }),
      increaseSignal: () => dispatch({ type: 'INCREASE_SIGNAL' }),
      reset: () => dispatch({ type: 'RESET' })
    }),
    [state]
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialize(state)));
  }, [state]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGameState(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGameState must be used within GameProvider');
  }
  return ctx;
}
