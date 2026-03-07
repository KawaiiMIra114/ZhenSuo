export type RuneId =
  | 'RUNE_01'
  | 'RUNE_02'
  | 'RUNE_03'
  | 'RUNE_04'
  | 'RUNE_05'
  | 'RUNE_06'
  | 'RUNE_07';

export type FactId =
  | 'forum_url_discovered'
  | 'employee_8023_known'
  | 'forum_member_registered'
  | 'oa_url_discovered'
  | 'oa_maintenance_log_read'
  | 'meridian_suspicious'
  | 'shadow_archive_path_found'
  | 'shadow_archive_accessed'
  | 'linyuudon_message_found'
  | 'password_half_juku_found'
  | 'purchase_order_read'
  | 'disappearance_evidence_found'
  | 'password_instructions_found';

export interface GameState {
  currentPhase: 0 | 1 | 2 | 3 | 4 | 'ending_a' | 'ending_b' | 'ending_c';
  readNodes: Set<string>;
  forumAccess: 'public' | 'member' | 'admin' | 'shadow';
  oaLoggedIn: boolean;
  collectedRunes: Set<RuneId>;
  linXiaoSignalStrength: number;
  discoveredFacts: Set<FactId>;
  adminUnlocked: boolean;
  shadowArchiveAccessed: boolean;
  zhaoQiEmailShown: boolean;
  endingChosen: 'A' | 'B' | 'C' | null;
}

export interface SerializableState {
  currentPhase: GameState['currentPhase'];
  readNodes: string[];
  forumAccess: GameState['forumAccess'];
  oaLoggedIn: boolean;
  collectedRunes: RuneId[];
  linXiaoSignalStrength: number;
  discoveredFacts: FactId[];
  adminUnlocked: boolean;
  shadowArchiveAccessed: boolean;
  zhaoQiEmailShown: boolean;
  endingChosen: GameState['endingChosen'];
}

export const ALL_RUNES: RuneId[] = [
  'RUNE_01',
  'RUNE_02',
  'RUNE_03',
  'RUNE_04',
  'RUNE_05',
  'RUNE_06',
  'RUNE_07'
];
