import { computed, Injectable, signal } from '@angular/core';
import { BoardType, GameMode } from '../../utils/types';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  _settings = signal<Map<string, number>>(new Map<string, number>());
  settings = computed(this._settings);

  setGameSettings(settings: Map<string, number>) {
    this._settings.set(settings);
  }
  getGameSettings() {
    return this.settings;
  }

  _boardType = signal<BoardType>(BoardType.Classic);
  boardType = computed(this._boardType);

  setBoardType(boardType: BoardType) {
    this._boardType.set(boardType);
  }
  getBoardType() {
    return this.boardType;
  }

  _gameLevel = signal<GameMode>(GameMode.BEGINNER);
  gameLevel = computed(this._gameLevel);

  setGameLevel(gameLevel: GameMode) {
    this._gameLevel.set(gameLevel);
  }
  getGameLevel() {
    return this.gameLevel;
  }
}
