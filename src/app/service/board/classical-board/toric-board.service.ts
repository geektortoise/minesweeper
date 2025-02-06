import { Injectable } from '@angular/core';
import { Tile } from '../../../tile/tile';
import { ClassicalBoard } from '../../../board/classical-board/classical-board';
import { GenerationStrategy } from '../../../utils/types';
import { Util } from '../../../utils/util';
import { ClassicalBoardService } from './classical-board.service';

@Injectable({
  providedIn: 'root',
})
export class ToricBoardService extends ClassicalBoardService {
  protected override getNeighbors(
    tileBoard: Tile[][],
    row: number,
    column: number,
  ) {
    console.log('ToricBoardService :: getNeighbors');
    let neighbors = [];
    let rowIndex = row;
    let columnIndex = column;

    for (var i = -1; i <= 1; i++) {
      rowIndex = row + i;
      if (rowIndex < 0) rowIndex = tileBoard.length - 1;
      if (rowIndex >= tileBoard.length) rowIndex = 0;
      for (var j = -1; j <= 1; j++) {
        if (i == 0 && j == 0) continue;
        columnIndex = column + j;
        if (columnIndex < 0) columnIndex = tileBoard[row].length - 1;
        if (columnIndex >= tileBoard[row].length) columnIndex = 0;
        neighbors.push(tileBoard[rowIndex][columnIndex]);
      }
    }
    return neighbors;
  }
}
