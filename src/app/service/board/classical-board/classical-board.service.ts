import { Injectable } from '@angular/core';
import { Tile } from '../../../tile/tile';
import { ClassicalBoard } from '../../../board/classical-board/classical-board';
import { GenerationStrategy } from '../../../utils/types';
import { Util } from '../../../utils/util';
import { BoardService } from '../board.service';

@Injectable({
  providedIn: 'root',
})
export class ClassicalBoardService extends BoardService {
  generateTileBoard(
    rowsNumber: number,
    columnsNumber: number,
    minesNumber: number,
    generationStrategy: GenerationStrategy,
  ): ClassicalBoard {
    let classicalBoard = new ClassicalBoard(1, minesNumber);

    let tiles = this.tileService.generateTiles(rowsNumber * columnsNumber);
    if (generationStrategy == 'BEFORE_STARTING') {
      tiles = this.tileService.assignMines(tiles, minesNumber);
    }

    //set them in a two dimensional array
    let tileIdx = 0;
    let tileBoard: Tile[][] = [];
    for (var i = 0; i < rowsNumber; i++) {
      tileBoard[i] = [];
      for (var j = 0; j < columnsNumber; j++) {
        tileBoard[i].push(tiles[tileIdx]);
        tileIdx++;
      }
    }

    //set the neighboors for each tile
    for (let i = 0; i < tileBoard.length; i++) {
      for (let j = 0; j < tileBoard[i].length; j++) {
        tileBoard[i][j].neighbors = this.getNeighbors(tileBoard, i, j);
      }
    }

    classicalBoard.tileSet = tiles;
    classicalBoard.tiles = tileBoard;
    classicalBoard.numberOfUnRevealedTiles = rowsNumber * columnsNumber;
    return classicalBoard;
  }

  protected getNeighbors(tileBoard: Tile[][], row: number, column: number) {
    let neighbors = [];
    for (var i = -1; i <= 1; i++) {
      if (row + i < 0 || row + i >= tileBoard.length) continue;
      for (var j = -1; j <= 1; j++) {
        if (column + j < 0 || column + j >= tileBoard[row].length) continue;
        if (i == 0 && j == 0) continue;
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

  private assignMinesAroundTile(
    tileBoard: Tile[][],
    minesNumber: number,
    tile: Tile,
  ): void {
    let tilesToAvoid = tile.neighbors.slice();
    tilesToAvoid.push(tile);
    let boardSize = tileBoard[0].length * tileBoard.length;

    minesNumber = Math.min(boardSize, minesNumber);
    let isItPossible = true;

    if (boardSize - tilesToAvoid.length < minesNumber) isItPossible = false;

    while (minesNumber > 0) {
      let row = Util.getRandomInt(0, tileBoard.length);
      let column = Util.getRandomInt(0, tileBoard[0].length);
      let evaluatedTile = tileBoard[row][column];
      if (
        !isItPossible ||
        (!tilesToAvoid.includes(evaluatedTile) && !evaluatedTile.isMine)
      ) {
        evaluatedTile.isMine = true;
        minesNumber--;
      }
    }

    return;
  }
}
