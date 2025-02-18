import { Injectable } from '@angular/core';
import { ClassicalBoardService } from '../classical-board.service';
import { Tile } from '../../../../model/tile';

@Injectable({
  providedIn: 'root',
})
export class ToricBoardService extends ClassicalBoardService {
  public override getNeighbors(
    tileBoard: Tile[][],
    row: number,
    column: number,
  ) {
    let neighbors = [];
    let rowIndex = row;
    let columnIndex = column;

    for (let i = -1; i <= 1; i++) {
      rowIndex = row + i;
      if (rowIndex < 0) rowIndex = tileBoard.length - 1;
      if (rowIndex >= tileBoard.length) rowIndex = 0;
      for (let j = -1; j <= 1; j++) {
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
