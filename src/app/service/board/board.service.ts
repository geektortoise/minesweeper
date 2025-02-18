import { Injectable } from '@angular/core';
import { Board } from '../../model/board';
import { TileService } from '../tile/tile.service';
import { Tile } from '../../model/tile';
import { GameMode, GridDimensionOption } from '../../utils/types';

@Injectable({
  providedIn: 'root',
})
export abstract class BoardService {
  protected tileService: TileService;

  constructor(tileService: TileService) {
    this.tileService = tileService;
  }

  revealTile(board: Board, tile: Tile): void {
    if (tile?.isRevealed) {
      let surroundingMines = tile.getThreatCount();
      let flaggedMines = tile.neighbors.filter((n) => n.isFlagged).length;
      if (surroundingMines > 0 && flaggedMines == surroundingMines) {
        tile.neighbors
          .filter((n) => !n.isRevealed && !n.isFlagged)
          .forEach((n) => this.revealTile(board, n));
      }
      return;
    }

    if (tile?.isMine) {
      this.tileService.reveal(tile);
      this.setGameOver(board);
    } else {
      this.tileService.reveal(tile);
      this.checkVictory(board);
    }
  }

  setGameOver(board: Board) {
    board.status = 'GAMEOVER';
    //reveal all mines and flagged tile
    board.tileSet
      .filter((tile) => tile.isMine || tile.isFlagged)
      .forEach((tile) => (tile.isRevealed = true));
  }

  checkVictory(board: Board) {
    if (
      board.tileSet.filter((tile) => !tile.isMine && !tile.isRevealed).length ==
      0
    ) {
      //if all not mine are revealed, you win
      board.status = 'WON';
    }
  }

  abstract getDimensions(): GridDimensionOption[];
  abstract getDefaultConfigsMap(): Map<GameMode, Map<string, number>>;
}
