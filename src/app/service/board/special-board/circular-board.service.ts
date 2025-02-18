import { Injectable } from '@angular/core';
import { BiDimensionalBoard } from '../../../model/bi-dimensional-board';
import { Tile } from '../../../model/tile';
import { GameMode, GenerationStrategy } from '../../../utils/types';
import { BiDimensionalBoardService } from '../bi-dimensional-board.service';

@Injectable({
  providedIn: 'root',
})
export class CircularBoardService extends BiDimensionalBoardService {
  generateTileBoard(
    radius: number,
    minesNumber: number,
    generationStrategy: GenerationStrategy,
  ): BiDimensionalBoard {
    let circleBoard = new BiDimensionalBoard(1, minesNumber);
    let diameter = 2 * radius + 1;

    //begin with an all disabled array
    let tileBoard: Tile[][] = [];
    for (let i = 0; i < diameter; i++) {
      tileBoard[i] = [];
      for (let j = 0; j < diameter; j++) {
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
    for (let i = 0; i < tileBoard.length; i++) {
      for (let j = 0; j < tileBoard.length; j++) {
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

  getDimensions() {
    let dimensions = [
      { label: 'radius', settingName: 'radius', min: 3 },
      { label: 'mines', settingName: 'minesNumber', min: 1 },
    ];
    return dimensions;
  }
  getDefaultConfigsMap(): Map<GameMode, Map<string, number>> {
    let defaultConfigsMap: Map<GameMode, Map<string, number>> = new Map<
      GameMode,
      Map<string, number>
    >();

    let beginner: Map<string, number> = new Map();
    beginner.set('radius', 7);
    beginner.set('minesNumber', 18);
    defaultConfigsMap.set(GameMode.BEGINNER, beginner);

    let median = new Map();
    median.set('radius', 10);
    median.set('minesNumber', 48);
    defaultConfigsMap.set(GameMode.INTERMEDIATE, median);

    let pro = new Map();
    pro.set('radius', 13);
    pro.set('minesNumber', 72);
    defaultConfigsMap.set(GameMode.EXPERT, pro);
    return defaultConfigsMap;
  }

  //Bresenham algo
  private drawCircle(tileBoard: Tile[][], radius: number) {
    let center_x = radius + 1;
    let center_y = radius + 1;
    let x = 0;
    let y = radius;
    let m = 5 - 4 * radius;

    while (x <= y) {
      tileBoard[x + center_x - 1][y + center_y - 1] =
        this.tileService.generateTile(true, false);
      tileBoard[y + center_x - 1][x + center_y - 1] =
        this.tileService.generateTile(true, false);
      tileBoard[-x + center_x - 1][y + center_y - 1] =
        this.tileService.generateTile(true, false);
      tileBoard[-y + center_x - 1][x + center_y - 1] =
        this.tileService.generateTile(true, false);
      tileBoard[x + center_x - 1][-y + center_y - 1] =
        this.tileService.generateTile(true, false);
      tileBoard[y + center_x - 1][-x + center_y - 1] =
        this.tileService.generateTile(true, false);
      tileBoard[-x + center_x - 1][-y + center_y - 1] =
        this.tileService.generateTile(true, false);
      tileBoard[-y + center_x - 1][-x + center_y - 1] =
        this.tileService.generateTile(true, false);
      if (m > 0) {
        y = y - 1;
        m = m - 8 * y;
      }
      x = x + 1;
      m = m + 8 * x + 4;
    }
  }

  private fillCircle(tileBoard: Tile[][]) {
    for (let i = 0; i < tileBoard.length; i++) {
      let j = 0;
      while (!tileBoard[i][j].isEnabled) j++;
      let k = tileBoard.length - 1;
      while (!tileBoard[i][k].isEnabled) k--;

      for (let l = j; l <= k; l++) {
        tileBoard[i][l] = this.tileService.generateTile(true, false);
      }
    }
  }
}
