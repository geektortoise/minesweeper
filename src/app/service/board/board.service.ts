import { Injectable } from '@angular/core';
import { Tile } from '../../tile/tile';
import { Board } from '../../board/board';
import { TileService } from '../tile/tile.service';
import { OverlayService } from '../overlay/overlay.service';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  protected tileService: TileService;

  constructor(
    tileService: TileService,
    private overlayService: OverlayService,
  ) {
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
      this.overlayService.on();
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
    console.log('checkVictory');
    console.log(board.tileSet.length);
    if (
      board.tileSet.filter((tile) => !tile.isMine && !tile.isRevealed).length ==
      0
    ) {
      //if all not mine are revealed, you win
      board.status = 'WON';
    }
  }
}
