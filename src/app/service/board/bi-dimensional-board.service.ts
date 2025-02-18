import { Injectable } from '@angular/core';
import { BoardService } from './board.service';
import { Tile } from '../../model/tile';
import { GenerationStrategy } from '../../utils/types';
import { Util } from '../../utils/util';

@Injectable({
  providedIn: 'root',
})
export abstract class BiDimensionalBoardService extends BoardService {
  getNeighbors(tileBoard: Tile[][], row: number, column: number) {
    let neighbors = [];
    for (let i = -1; i <= 1; i++) {
      if (row + i < 0 || row + i >= tileBoard.length) continue;
      for (let j = -1; j <= 1; j++) {
        if (column + j < 0 || column + j >= tileBoard[row].length) continue;
        if (i == 0 && j == 0) continue;
        if (!tileBoard[row + i][column + j].isEnabled) continue;
        neighbors.push(tileBoard[row + i][column + j]);
      }
    }
    return neighbors;
  }

  finishInitialization(
    tileBoard: Tile[][],
    generationStrategy: GenerationStrategy,
    minesNumber: number,
    tile: Tile,
  ): void {
    if (generationStrategy == 'AT_FIRST_CLICK') {
      this.assignMinesAroundTile(tileBoard, minesNumber, tile);
    }
  }

  getTilesNumber(tileBoard: Tile[][]) {
    return tileBoard
      .map((row) => row.filter((t) => t.isEnabled).length)
      .reduce((a, b) => a + b, 0);
  }

  protected assignMinesAroundTile(
    tileBoard: Tile[][],
    minesNumber: number,
    tile: Tile,
  ): void {
    let tilesToAvoid = tile.neighbors.slice();
    tilesToAvoid.push(tile);
    let boardSize = this.getTilesNumber(tileBoard);

    minesNumber = Math.min(boardSize, minesNumber);

    while (boardSize - tilesToAvoid.length < minesNumber) {
      tilesToAvoid.shift();
    }

    while (minesNumber > 0) {
      let row = Util.getRandomInt(0, tileBoard.length);
      let column = Util.getRandomInt(0, tileBoard[0].length);
      let evaluatedTile = tileBoard[row][column];
      if (!evaluatedTile.isEnabled) continue;
      if (evaluatedTile.isMine) continue;
      if (!tilesToAvoid.includes(evaluatedTile)) {
        evaluatedTile.isMine = true;
        minesNumber--;
      }
    }
  }
}
