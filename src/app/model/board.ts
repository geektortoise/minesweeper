import { Tile } from './tile';

export abstract class Board {
  id: number;
  status: 'ONGOING' | 'GAMEOVER' | 'WON';
  tileSet: Tile[];

  constructor(id: number) {
    this.id = id;
    this.status = 'ONGOING';
    this.tileSet = [];
  }
  isGameOver(): boolean {
    return this.status == 'GAMEOVER';
  }

  isWon(): boolean {
    return this.status == 'WON';
  }
}
