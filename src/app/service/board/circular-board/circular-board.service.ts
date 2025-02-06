import { Injectable } from '@angular/core';
import { Tile } from '../../../tile/tile';
import { ClassicalBoard } from '../../../board/classical-board/classical-board';
import { GenerationStrategy } from '../../../utils/types';
import { Util } from '../../../utils/util';
import { BoardService } from '../board.service';

@Injectable({
  providedIn: 'root',
})
export class CircularBoardService extends BoardService {
  // ou extends Classical ?

  generateTileBoard(
    radius: number,
    minesNumber: number,
    generationStrategy: GenerationStrategy,
  ): ClassicalBoard {
    let circleBoard = new ClassicalBoard(1, minesNumber);
    let diameter = 2 * radius + 1;

    //begin with an all disabled array
    let tileBoard: Tile[][] = [];
    for (var i = 0; i < diameter; i++) {
      tileBoard[i] = [];
      for (var j = 0; j < diameter; j++) {
        tileBoard[i].push(this.tileService.getDeadTile());
      }
    }
    //then enable only the perimeter of the circle
    this.drawCircle(tileBoard, radius);
    //fill the circle
    this.fillCircle(tileBoard);

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

  //this is for DIAMOND board
  /*generateTileBoard(
    radius: number,
    minesNumber: number,
    generationStrategy: GenerationStrategy,
  ): ClassicalBoard {
    let diameter = 2*radius + 1;
    let circleBoard = new ClassicalBoard(1, minesNumber);
    let tilesNumber = this.determineTileNumberFromRadius(radius);

    let tiles = this.tileService.generateTiles(tilesNumber);
    if (generationStrategy == 'BEFORE_STARTING') {
      tiles = this.tileService.assignMines(tiles, minesNumber);
    }

    //set them in a two dimensional array
    let tileIdx = 0;
    let tileBoard: Tile[][] = [];
    for (var i = 0; i < diameter; i++) {
      tileBoard[i] = [];
      let tilesToSet;

      if(i <= radius) {
        tilesToSet = 2*i +1;
      } else {
        tilesToSet = 2*(diameter-(i+1)) +1;
      }
      let deadTileNumber = diameter - tilesToSet;

      for (var j = 0; j < diameter; j++) {
        if(j<deadTileNumber/2) {
          tileBoard[i].push(
            this.tileService.getDeadTile()
          );
        }
        else if(j<tilesToSet+(deadTileNumber/2)) {
          tileBoard[i].push(tiles[tileIdx]);
          tileIdx++;
          }
        else {
          tileBoard[i].push(
            this.tileService.getDeadTile()
          );
        }
      }
    }

    //set the neighboors for each active tile
    for (let i = 0; i < tileBoard.length; i++) {
      for (let j = 0; j < tileBoard[i].length; j++) {
        if(!tileBoard[i][j].isEnabled) continue;
        tileBoard[i][j].neighbors = this.getNeighbors(tileBoard, i, j);
      }
    }

    circleBoard.tileSet = tiles;
    circleBoard.tiles = tileBoard;
    circleBoard.numberOfUnRevealedTiles = tilesNumber;
    return circleBoard;
  }*/

  //Bresenham algo
  private drawCircle(tileBoard: Tile[][], radius: number) {
    let center_x = radius + 1;
    let center_y = radius + 1;
    let x = 0;
    let y = radius;
    let m = 5 - 4 * radius;

    while (x <= y) {
      tileBoard[x + center_x - 1][y + center_y - 1] = new Tile(0, false);
      tileBoard[y + center_x - 1][x + center_y - 1] = new Tile(0, false);
      tileBoard[-x + center_x - 1][y + center_y - 1] = new Tile(0, false);
      tileBoard[-y + center_x - 1][x + center_y - 1] = new Tile(0, false);
      tileBoard[x + center_x - 1][-y + center_y - 1] = new Tile(0, false);
      tileBoard[y + center_x - 1][-x + center_y - 1] = new Tile(0, false);
      tileBoard[-x + center_x - 1][-y + center_y - 1] = new Tile(0, false);
      tileBoard[-y + center_x - 1][-x + center_y - 1] = new Tile(0, false);
      if (m > 0) {
        y = y - 1;
        m = m - 8 * y;
      }
      x = x + 1;
      m = m + 8 * x + 4;
    }
  }

  private fillCircle(tileBoard: Tile[][]) {
    for (var i = 0; i < tileBoard.length; i++) {
      var j = 0;
      while (!tileBoard[i][j].isEnabled) j++;
      var k = tileBoard.length - 1;
      while (!tileBoard[i][k].isEnabled) k--;

      for (var l = j; l <= k; l++) {
        tileBoard[i][l] = new Tile(0, false);
      }
    }
  }

  private getNeighbors(tileBoard: Tile[][], row: number, column: number) {
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
