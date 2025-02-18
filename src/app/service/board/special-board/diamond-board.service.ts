import { Injectable } from '@angular/core';
import { BiDimensionalBoard } from '../../../model/bi-dimensional-board';
import { Tile } from '../../../model/tile';
import { GameMode, GenerationStrategy } from '../../../utils/types';
import { BiDimensionalBoardService } from '../bi-dimensional-board.service';

@Injectable({
  providedIn: 'root',
})
export class DiamondBoardService extends BiDimensionalBoardService {
  generateTileBoard(
    radius: number,
    minesNumber: number,
    generationStrategy: GenerationStrategy,
  ): BiDimensionalBoard {
    let diameter = 2 * radius + 1;
    let circleBoard = new BiDimensionalBoard(1, minesNumber);
    let tilesNumber = this.determineTileNumberFromRadius(radius);

    let tiles = this.tileService.generateTiles(tilesNumber);
    if (generationStrategy == 'BEFORE_STARTING') {
      tiles = this.tileService.assignMines(tiles, minesNumber);
    }

    //set them in a two dimensional array
    let tileIdx = 0;
    let tileBoard: Tile[][] = [];
    for (let i = 0; i < diameter; i++) {
      tileBoard[i] = [];
      let tilesToSet;

      if (i <= radius) {
        tilesToSet = 2 * i + 1;
      } else {
        tilesToSet = 2 * (diameter - (i + 1)) + 1;
      }
      let deadTileNumber = diameter - tilesToSet;

      for (let j = 0; j < diameter; j++) {
        if (j < deadTileNumber / 2) {
          tileBoard[i].push(this.tileService.getDeadTile());
        } else if (j < tilesToSet + deadTileNumber / 2) {
          tileBoard[i].push(tiles[tileIdx]);
          tileIdx++;
        } else {
          tileBoard[i].push(this.tileService.getDeadTile());
        }
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

  determineTileNumberFromRadius(radius: number) {
    var result = 0;
    for (let i = 0; i < radius; i++) {
      result += (2 * i + 1) * 2;
    }
    result += 2 * radius + 1;
    return result;
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
}
