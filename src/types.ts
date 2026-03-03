// ═══════════════════════════════════════════
//  ZhenSuo V3 · 全局类型定义
// ═══════════════════════════════════════════

export type AppState =
  | 'warning'    // 内容警告
  | 'prologue'   // 序章
  | 'desktop'    // 桌面视窗
  | 'clinic'     // 白区·官网
  | 'forum'      // 灰区·论坛
  | 'oa'         // 黑区·OA系统
  | 'terminal'   // 终端
  | 'ending'     // 结局
  | 'shutdown';  // 关机惩罚序列

export type EndingType = 'A' | 'B' | 'C' | null;

// 游戏进度四阶段制（V3 §二）
export type GamePhase = 1 | 2 | 3 | 4;

// 七枚符文碎片 ID（V3 §4.2 碎片分布表）
export type RuneId =
  | 'RUNE_01'  // B2层7号柜照片·符纸右下角
  | 'RUNE_02'  // 3.14声明·附件C3链接
  | 'RUNE_03'  // 论坛帖B-3·封禁账号发言
  | 'RUNE_04'  // 林医生文章D-2·权限锁定段落
  | 'RUNE_05'  // OA赵启记事本·最后一页
  | 'RUNE_06'  // 官网LOGO·长凝视触发
  | 'RUNE_07'; // 桌面日历·3月13日黑叉

// InvestigateNode 反馈类型
export type FeedbackType = 'bubble' | 'glitch' | 'silent';

// 线索
export interface Clue {
  id: string;
  title: string;
  description: string;
}

// V3 完整游戏状态接口（§4.1）
export interface GameState {
  currentPhase: GamePhase;
  readHooks: string[];         // 已触发的进度锁 ID
  isOALoggedIn: boolean;
  collectedRunes: RuneId[];    // 已收集的符文碎片
  linXiaoSignalStrength: number; // 0-7，对应已收集碎片数
  completedEndings: string[];  // 已完成的结局 ID
}

// Context 暴露的完整接口
export interface GameContextType {
  // 导航
  currentApp: AppState;
  setCurrentApp: (app: AppState) => void;

  // 模式
  gentleMode: boolean;
  setGentleMode: (mode: boolean) => void;

  // 线索系统
  clues: Clue[];
  addClue: (clue: Clue) => void;
  hasClue: (id: string) => boolean;
  hasUnread: boolean;
  markAsRead: () => void;

  // V3 进度锁系统
  readHooks: string[];
  readHook: (hookId: string) => void;
  hasReadHook: (hookId: string) => boolean;

  // V3 阶段系统
  currentPhase: GamePhase;
  advancePhase: () => void;

  // V3 符文碎片系统
  collectedRunes: RuneId[];
  collectRune: (runeId: RuneId) => void;
  hasRune: (runeId: RuneId) => boolean;
  linXiaoSignalStrength: number;

  // V3 OA 登录拦截
  isOALoggedIn: boolean;
  setOALoggedIn: (v: boolean) => void;
  canLoginOA: () => boolean;

  // 结局系统
  endingType: EndingType;
  setEndingType: (type: EndingType) => void;
  completedEndings: string[];
  completeEnding: (endingId: string) => void;

  // 重置
  resetGame: () => void;
}
