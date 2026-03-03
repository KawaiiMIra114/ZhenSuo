export type AppState = 'warning' | 'prologue' | 'desktop' | 'clinic' | 'forum' | 'oa' | 'terminal' | 'ending';
export type EndingType = 'A' | 'B' | 'C' | null;

export interface Clue {
  id: string;
  title: string;
  description: string;
}

export interface GameContextType {
  currentApp: AppState;
  setCurrentApp: (app: AppState) => void;
  gentleMode: boolean;
  setGentleMode: (mode: boolean) => void;
  clues: Clue[];
  addClue: (clue: Clue) => void;
  fragments: number[];
  addFragment: (id: number) => void;
  hasClue: (id: string) => boolean;
  hasUnread: boolean;
  markAsRead: () => void;
  endingType: EndingType;
  setEndingType: (type: EndingType) => void;
  resetGame: () => void;
}
