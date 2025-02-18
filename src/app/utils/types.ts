export type GenerationStrategy = 'AT_FIRST_CLICK' | 'BEFORE_STARTING';

export enum GameMode {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  EXPERT = 'expert',
  CUSTOM = 'custom',
}

export enum BoardType {
  Classic = 'classic',
  Toric = 'toric',
  Circle = 'circle',
  Diamond = 'diamond',
  Axo = 'axo',
}

export type GridDimensionOption = {
  label: string;
  settingName: string;
  min: number;
};

export interface BoardInput {
  dimensions: number[];
  mines: number;
}

export interface NotificationStatus {
  status: string;
  flagged: number;
  time: number;
}

export type HistoryRecord = NotificationStatus & {
  level: GameMode;
  type: BoardType;
  date: Date;
  inputs?: BoardInput;
};

export interface OverlayData {
  display: boolean;
  content?: OverlayContent;
}

export enum OverlayContent {
  EXPLOSION = 1,
  HISTORY = 2,
}
