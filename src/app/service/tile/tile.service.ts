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
    const tilesToReveal = [tile];

    while (tilesToReveal.length > 0) {
      const currentTile = tilesToReveal.pop()!;

      if (currentTile.isFlagged) continue;
      if (currentTile.isRevealed) continue;
      currentTile.isRevealed = true;

      if (currentTile.isMine) continue;

      let threatCount = currentTile.getThreatCount();
      if (threatCount == 0) {
        for (let neighbor of currentTile.neighbors) {
          if (!neighbor.isRevealed && !neighbor.isFlagged) {
            tilesToReveal.push(neighbor);
          }
        }
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
