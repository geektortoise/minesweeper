import { Injectable } from '@angular/core';
import { Tile } from '../../../tile/tile';
import { ClassicalBoard } from '../../../board/classical-board/classical-board';
import { GenerationStrategy } from '../../../utils/types';
import { Util } from '../../../utils/util';
import { BoardService } from '../board.service';

@Injectable({
  providedIn: 'root',
})
export class AxoBoardService extends BoardService {
  // ou extends Classical ?

  generateTileBoard(
    minesNumber: number,
    generationStrategy: GenerationStrategy,
  ): ClassicalBoard {
    let pattern = [
      [
        'o',
        'o',
        'o',
        'x',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'x',
        'o',
        'o',
        'o',
      ],
      [
        'o',
        'o',
        'o',
        'x',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'x',
        'o',
        'o',
        'o',
      ],
      [
        'o',
        'o',
        'o',
        'x',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'x',
        'o',
        'o',
        'o',
      ],
      [
        'o',
        'o',
        'o',
        'x',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'x',
        'o',
        'o',
        'o',
      ],
      [
        'x',
        'x',
        'o',
        'x',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'x',
        'o',
        'x',
        'x',
      ],
      [
        'x',
        'x',
        'o',
        'o',
        'x',
        'x',
        'o',
        'x',
        'x',
        'x',
        'o',
        'x',
        'x',
        'o',
        'o',
        'x',
        'x',
      ],
      [
        'x',
        'x',
        'x',
        'o',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'o',
        'x',
        'x',
        'x',
      ],
      [
        'o',
        'x',
        'x',
        'x',
        'o',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'o',
        'x',
        'x',
        'o',
      ],
      [
        'o',
        'o',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'o',
        'o',
      ],
      [
        'x',
        'o',
        'o',
        'x',
        'x',
        'o',
        'x',
        'x',
        'x',
        'x',
        'x',
        'o',
        'x',
        'x',
        'o',
        'o',
        'x',
      ],
      [
        'x',
        'x',
        'o',
        'x',
        'x',
        'o',
        'x',
        'x',
        'x',
        'x',
        'x',
        'o',
        'x',
        'x',
        'o',
        'x',
        'x',
      ],
      [
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
      ],
      [
        'o',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'o',
      ],
      [
        'o',
        'o',
        'o',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'o',
        'o',
        'o',
      ],
      [
        'o',
        'o',
        'o',
        'o',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'o',
        'o',
        'o',
        'o',
      ],
      [
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
      ],
      [
        'o',
        'o',
        'o',
        'o',
        'o',
        'o',
        'x',
        'x',
        'x',
        'x',
        'x',
        'x',
        'o',
        'o',
        'o',
        'o',
        'o',
      ],
    ];

    let circleBoard = new ClassicalBoard(1, minesNumber);
    let sizeLength = pattern.length;

    let tileBoard: Tile[][] = [];
    for (var i = 0; i < sizeLength; i++) {
      tileBoard[i] = [];
      for (var j = 0; j < sizeLength; j++) {
        if (pattern[i][j] == 'x') {
          tileBoard[i].push(new Tile(0, false));
        } else {
          tileBoard[i].push(this.tileService.getDeadTile());
        }
      }
    }

    //je met ici les cases pour le board AXO
    //x n'est pas une mine mais l'endroit où il y aura un case clickable
    //17 de large
    // 17 de haut
    // [o,o,o,x,x,o,o,o,o,o,o,o,x,x,o,o,o]
    // [o,o,o,x,x,o,o,o,o,o,o,o,x,x,o,o,o]

    // [o,o,o,x,x,o,o,o,o,o,o,o,x,x,o,o,o]
    // [o,o,o,x,x,o,o,o,o,o,o,o,x,x,o,o,o]
    // [x,x,o,x,x,o,o,o,o,o,o,o,x,x,o,x,x]
    // [x,x,o,o,x,x,o,x,x,x,o,x,x,o,o,x,x]
    // [x,x,x,o,x,x,x,x,x,x,x,x,x,o,x,x,x]

    // [o,x,x,x,o,x,x,x,x,x,x,x,x,o,x,x,o]
    // [o,o,x,x,x,x,x,x,x,x,x,x,x,x,x,o,o]
    // [x,o,o,x,x,o,x,x,x,x,x,o,x,x,o,o,x]
    // [x,x,o,x,x,o,x,x,x,x,x,o,x,x,o,x,x]
    // [x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x]

    // [o,x,x,x,x,x,x,x,x,x,x,x,x,x,x,x,o]
    // [o,o,o,x,x,x,x,x,x,x,x,x,x,x,o,o,o]
    // [o,o,o,o,x,x,x,x,x,x,x,x,x,o,o,o,o]
    // [o,o,o,o,o,x,x,x,x,x,x,x,o,o,o,o,o]
    // [o,o,o,o,o,o,x,x,x,x,x,x,o,o,o,o,o]

    let tilesNumber = this.getTilesNumber(tileBoard);

    let tiles = this.tileService.generateTiles(tilesNumber);
    if (generationStrategy == 'BEFORE_STARTING') {
      tiles = this.tileService.assignMines(tiles, minesNumber);
    }

    //reassign tile to the 'correct spots' of the board
    let tileIdx = 0;
    for (var i = 0; i < tileBoard.length; i++) {
      for (var j = 0; j < tileBoard.length; j++) {
        if (!tileBoard[i][j].isEnabled) continue;
        tileBoard[i][j] = tiles[tileIdx];
        tileIdx++;
      }
    }

    //set the neighboors for each active tile
    for (let i = 0; i < tileBoard.length; i++) {
      for (let j = 0; j < tileBoard[i].length; j++) {
        if (!tileBoard[i][j].isEnabled) continue;
        tileBoard[i][j].neighbors = this.getNeighbors(tileBoard, i, j);
      }
    }

    circleBoard.tileSet = tiles;
    circleBoard.tiles = tileBoard;
    circleBoard.numberOfUnRevealedTiles = tilesNumber;
    return circleBoard;
  }

  private getNeighbors(tileBoard: Tile[][], row: number, column: number) {
    //appeler celle de classsicalboard service par composition ?
    let neighbors = [];
    for (var i = -1; i <= 1; i++) {
      if (row + i < 0 || row + i >= tileBoard.length) continue;
      for (var j = -1; j <= 1; j++) {
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
    // le mettre dans board service ou classical service ?
    var result = 0;
    for (var i = 0; i < tileBoard.length; i++) {
      result += tileBoard[i].filter((t) => t.isEnabled).length;
    }
    console.log('test ' + result);
    return result;
  }

  private assignMinesAroundTile(
    //Todo voir si c'est le meme que classical board pour l'appeler par composition ?
    tileBoard: Tile[][],
    minesNumber: number,
    tile: Tile,
  ): void {
    let tilesToAvoid = tile.neighbors.slice();
    tilesToAvoid.push(tile);
    let boardSize = this.getTilesNumber(tileBoard);

    minesNumber = Math.min(boardSize, minesNumber);
    let isItPossible = true;

    if (boardSize - tilesToAvoid.length < minesNumber) isItPossible = false;

    while (minesNumber > 0) {
      let row = Util.getRandomInt(0, tileBoard.length);
      let column = Util.getRandomInt(0, tileBoard[0].length);
      let evaluatedTile = tileBoard[row][column];
      if (!evaluatedTile.isEnabled) continue;

      if (
        !isItPossible || //bug possible. Si on est dans le cas où c'est pas possible autrement, on pourrait retaper une mine sur une mine et ne plus avoir le compte
        (!tilesToAvoid.includes(evaluatedTile) && !evaluatedTile.isMine)
      ) {
        evaluatedTile.isMine = true;
        minesNumber--;
      }
    }

    return;
  }
}
