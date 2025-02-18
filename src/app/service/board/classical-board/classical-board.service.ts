import { Injectable } from '@angular/core';
import { Tile } from '../../../model/tile';
import { BiDimensionalBoard } from '../../../model/bi-dimensional-board';
import { GameMode, GenerationStrategy } from '../../../utils/types';
import { BiDimensionalBoardService } from '../bi-dimensional-board.service';

@Injectable({
  providedIn: 'root',
})
export class ClassicalBoardService extends BiDimensionalBoardService {
  generateTileBoard(
    rowsNumber: number,
    columnsNumber: number,
    minesNumber: number,
    generationStrategy: GenerationStrategy,
  ): BiDimensionalBoard {
    let classicalBoard = new BiDimensionalBoard(1, minesNumber);

    let tiles = this.tileService.generateTiles(rowsNumber * columnsNumber);
    if (generationStrategy == 'BEFORE_STARTING') {
      tiles = this.tileService.assignMines(tiles, minesNumber);
    }

    //set them in a two dimensional array
    let tileIdx = 0;
    let tileBoard: Tile[][] = [];
    for (let i = 0; i < rowsNumber; i++) {
      tileBoard[i] = [];
      for (let j = 0; j < columnsNumber; j++) {
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

  public override getTilesNumber(tileBoard: Tile[][]) {
    return tileBoard[0].length * tileBoard.length;
  }

  getDimensions() {
    let dimensions = [
      { label: 'rows', settingName: 'rowsNumber', min: 3 },
      { label: 'columns', settingName: 'columnsNumber', min: 3 },
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
    beginner.set('rowsNumber', 10);
    beginner.set('columnsNumber', 10);
    beginner.set('minesNumber', 18);
    defaultConfigsMap.set(GameMode.BEGINNER, beginner);

    let median = new Map();
    median.set('rowsNumber', 16);
    median.set('columnsNumber', 16);
    median.set('minesNumber', 48);
    defaultConfigsMap.set(GameMode.INTERMEDIATE, median);

    let pro = new Map();
    pro.set('rowsNumber', 16);
    pro.set('columnsNumber', 24);
    pro.set('minesNumber', 72);
    defaultConfigsMap.set(GameMode.EXPERT, pro);
    return defaultConfigsMap;
  }
}
