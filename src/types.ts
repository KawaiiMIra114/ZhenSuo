export type AppState = 'warning' | 'desktop' | 'clinic' | 'forum' | 'oa' | 'terminal' | 'ending';

export interface Clue {
  id: string;
  title: string;
  description: string;
}

export interface GameContextType {
  currentApp: AppState;
  setCurrentApp: (app: AppState) => void;
  clues: Clue[];
  addClue: (clue: Clue) => void;
  fragments: number[];
  addFragment: (id: number) => void;
  hasClue: (id: string) => boolean;
  hasUnread: boolean;
  markAsRead: () => void;
}
