import { Injectable } from '@angular/core';
import {
  GameMode,
  GenerationStrategy,
  GridDimensionOption,
} from '../../../utils/types';
import { BiDimensionalBoard } from '../../../model/bi-dimensional-board';
import { Tile } from '../../../model/tile';
import { BiDimensionalBoardService } from '../bi-dimensional-board.service';

@Injectable({
  providedIn: 'root',
})
export class AxoBoardService extends BiDimensionalBoardService {
  generateTileBoard(
    minesNumber: number,
    generationStrategy: GenerationStrategy,
  ): BiDimensionalBoard {
    // o are the dead tiles
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

    let circleBoard = new BiDimensionalBoard(1, minesNumber);
    let sizeLength = pattern.length;

    let tileBoard: Tile[][] = [];
    for (let i = 0; i < sizeLength; i++) {
      tileBoard[i] = [];
      for (let j = 0; j < sizeLength; j++) {
        tileBoard[i].push(
          this.tileService.generateTile(pattern[i][j] == 'x', false),
        );
      }
    }

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
    let dimensions = [] as GridDimensionOption[];
    return dimensions;
  }
  getDefaultConfigsMap(): Map<GameMode, Map<string, number>> {
    let defaultConfigsMap: Map<GameMode, Map<string, number>> = new Map<
      GameMode,
      Map<string, number>
    >();
    return defaultConfigsMap;
  }
}
