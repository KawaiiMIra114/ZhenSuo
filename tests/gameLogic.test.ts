import { describe, expect, it } from 'vitest';

type RuneId =
  | 'RUNE_01'
  | 'RUNE_02'
  | 'RUNE_03'
  | 'RUNE_04'
  | 'RUNE_05'
  | 'RUNE_06'
  | 'RUNE_07';

interface GameModel {
  discoveredFacts: string[];
  collectedRunes: RuneId[];
  signalBoost: number;
  erasureActive: boolean;
}

const ALL_RUNES: RuneId[] = [
  'RUNE_01',
  'RUNE_02',
  'RUNE_03',
  'RUNE_04',
  'RUNE_05',
  'RUNE_06',
  'RUNE_07',
];

function createInitialState(): GameModel {
  return {
    discoveredFacts: [],
    collectedRunes: [],
    signalBoost: 0,
    erasureActive: false,
  };
}

function addFact(state: GameModel, factId: string): void {
  if (!state.discoveredFacts.includes(factId)) {
    state.discoveredFacts.push(factId);
  }
}

function hasFact(state: GameModel, factId: string): boolean {
  return state.discoveredFacts.includes(factId);
}

function canLoginOA(state: GameModel): boolean {
  return hasFact(state, 'oa_url_discovered') && hasFact(state, 'employee_8023_known');
}

function canAdminLogin(state: GameModel): boolean {
  return hasFact(state, 'forum_member_registered');
}

function collectRune(state: GameModel, runeId: RuneId): void {
  if (!state.collectedRunes.includes(runeId)) {
    state.collectedRunes.push(runeId);
  }
}

function hasRune(state: GameModel, runeId: RuneId): boolean {
  return state.collectedRunes.includes(runeId);
}

function getLinXiaoSignalStrength(state: GameModel): number {
  return Math.min(state.collectedRunes.length + state.signalBoost, 7);
}

function canChooseC(state: GameModel): boolean {
  return state.collectedRunes.length >= 7;
}

function setErasureActive(state: GameModel, active: boolean): void {
  state.erasureActive = active;
}

function canShutdown(state: GameModel, ghostPhase: 'idle' | 'ready' = 'idle'): boolean {
  return !state.erasureActive || hasFact(state, 'erasure_shutdown_ready') || ghostPhase === 'ready';
}

function canTriggerTerminal(state: GameModel): boolean {
  return hasFact(state, 'password_half_juku_found') && hasFact(state, 'linyuudon_message_found');
}

function resetGameState(): GameModel {
  return createInitialState();
}

describe('Fact系统', () => {
  it('addFact 写入后 hasFact 返回 true', () => {
    const state = createInitialState();
    addFact(state, 'forum_url_discovered');
    expect(hasFact(state, 'forum_url_discovered')).toBe(true);
  });

  it('重复写入同一个Fact不产生重复项', () => {
    const state = createInitialState();
    addFact(state, 'forum_url_discovered');
    addFact(state, 'forum_url_discovered');
    expect(state.discoveredFacts).toHaveLength(1);
  });

  it('不存在的Fact返回false', () => {
    const state = createInitialState();
    expect(hasFact(state, 'not_exists_fact')).toBe(false);
  });
});

describe('OA登录前置条件', () => {
  it('缺oa_url_discovered时 canLoginOA() 返回 false', () => {
    const state = createInitialState();
    addFact(state, 'employee_8023_known');
    expect(canLoginOA(state)).toBe(false);
  });

  it('缺employee_8023_known时返回 false', () => {
    const state = createInitialState();
    addFact(state, 'oa_url_discovered');
    expect(canLoginOA(state)).toBe(false);
  });

  it('两项都有时返回 true', () => {
    const state = createInitialState();
    addFact(state, 'oa_url_discovered');
    addFact(state, 'employee_8023_known');
    expect(canLoginOA(state)).toBe(true);
  });
});

describe('管理员登录前置条件', () => {
  it('只有forum_member_registered时条件满足', () => {
    const state = createInitialState();
    addFact(state, 'forum_member_registered');
    expect(canAdminLogin(state)).toBe(true);
  });

  it('只有employee_8023_known时条件不满足（入口按钮不显示）', () => {
    const state = createInitialState();
    addFact(state, 'employee_8023_known');
    expect(canAdminLogin(state)).toBe(false);
  });
});

describe('碎片收集', () => {
  it('收集后hasRune返回true', () => {
    const state = createInitialState();
    collectRune(state, 'RUNE_01');
    expect(hasRune(state, 'RUNE_01')).toBe(true);
  });

  it('重复收集不产生重复项', () => {
    const state = createInitialState();
    collectRune(state, 'RUNE_01');
    collectRune(state, 'RUNE_01');
    expect(state.collectedRunes).toHaveLength(1);
  });

  it('linXiaoSignalStrength 等于 collectedRunes.length + signalBoost，上限7', () => {
    const state = createInitialState();
    collectRune(state, 'RUNE_01');
    collectRune(state, 'RUNE_02');
    collectRune(state, 'RUNE_03');
    state.signalBoost = 10;
    expect(getLinXiaoSignalStrength(state)).toBe(7);
  });
});

describe('结局C解锁条件', () => {
  it('碎片少于7枚时 canChooseC 为 false', () => {
    const state = createInitialState();
    ALL_RUNES.slice(0, 6).forEach((runeId) => collectRune(state, runeId));
    expect(canChooseC(state)).toBe(false);
  });

  it('7枚时为 true', () => {
    const state = createInitialState();
    ALL_RUNES.forEach((runeId) => collectRune(state, runeId));
    expect(canChooseC(state)).toBe(true);
  });
});

describe('erasureActive状态', () => {
  it('初始为false', () => {
    const state = createInitialState();
    expect(state.erasureActive).toBe(false);
  });

  it('setErasureActive(true)后为true', () => {
    const state = createInitialState();
    setErasureActive(state, true);
    expect(state.erasureActive).toBe(true);
  });

  it('erasureActive为true时 canShutdown 初始为 false，写入 erasure_shutdown_ready 后为 true', () => {
    const state = createInitialState();
    setErasureActive(state, true);
    expect(canShutdown(state)).toBe(false);
    addFact(state, 'erasure_shutdown_ready');
    expect(canShutdown(state)).toBe(true);
  });
});

describe('终局触发前置条件', () => {
  it('缺password_half_juku_found时不触发', () => {
    const state = createInitialState();
    addFact(state, 'linyuudon_message_found');
    expect(canTriggerTerminal(state)).toBe(false);
  });

  it('缺linyuudon_message_found时不触发', () => {
    const state = createInitialState();
    addFact(state, 'password_half_juku_found');
    expect(canTriggerTerminal(state)).toBe(false);
  });

  it('两项都有时触发', () => {
    const state = createInitialState();
    addFact(state, 'password_half_juku_found');
    addFact(state, 'linyuudon_message_found');
    expect(canTriggerTerminal(state)).toBe(true);
  });
});

describe('重置游戏', () => {
  it('resetGame后状态回到初始值', () => {
    const state = createInitialState();
    addFact(state, 'forum_member_registered');
    collectRune(state, 'RUNE_01');
    state.signalBoost = 3;
    setErasureActive(state, true);

    const resetState = resetGameState();

    expect(resetState.discoveredFacts).toEqual([]);
    expect(resetState.collectedRunes).toEqual([]);
    expect(resetState.erasureActive).toBe(false);
    expect(resetState.signalBoost).toBe(0);
  });
});
