import { Injectable } from '@angular/core';
import { Tile } from '../../model/tile';
import { Util } from '../../utils/util';

@Injectable({
  providedIn: 'root',
})
export class TileService {
  idCounter = 1;
  constructor() {}

  reveal(tile: Tile) {
    if (tile.isFlagged) return;
    if (tile.isRevealed) return;
    tile.isRevealed = true;

    if (tile.isMine) return;

    let threatCount = tile.getThreatCount();
    if (threatCount == 0) {
      for (let neighbor of tile.neighbors) {
        this.reveal(neighbor);
      }
    }
  }

  generateTiles(tilesNumber: number): Tile[] {
    let tiles: Tile[] = [];
    for (let i = 0; i < tilesNumber; i++) {
      tiles.push(this.generateTile(true, false));
    }
    return tiles;
  }

  assignMines(tiles: Tile[], minesNumber: number): Tile[] {
    let tilesNumber = tiles.length;
    minesNumber = Math.min(tilesNumber, minesNumber);
    while (minesNumber > 0) {
      let idxMine = Util.getRandomInt(0, tilesNumber);
      if (!tiles[idxMine].isMine) {
        tiles[idxMine].isMine = true;
        minesNumber--;
      }
    }
    return tiles;
  }

  generateTile(isEnabled = true, isMine = false) {
    let t: Tile = new Tile(this.idCounter++, isMine);
    if (!isEnabled) t.isEnabled = false;
    return t;
  }

  getDeadTile() {
    return this.generateTile(false, false);
  }
}
