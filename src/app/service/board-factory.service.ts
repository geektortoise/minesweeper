import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { ClassicalBoardComponent } from '../board/classical-board/classical-board.component';
import { BoardComponent } from '../board/board.component';
import { ToricBoardComponent } from '../board/classical-board/toric-board/toric-board.component';
import { CircleBoardComponent } from '../board/special-board/circle-board.component';
import { DiamondBoardComponent } from '../board/special-board/diamond-board.component';
import { AxoBoardComponent } from '../board/special-board/axo-board.component';
import { Board } from '../model/board';
import { GridOptionComponent } from '../option/grid-option/grid-option.component';
import { BoardType } from '../utils/types';

@Injectable({
  providedIn: 'root',
})
export class BoardFactoryService {
  componentMap: Record<BoardType, Type<BoardComponent<any>>> = {
    [BoardType.Classic]: ClassicalBoardComponent,
    [BoardType.Toric]: ToricBoardComponent,
    [BoardType.Circle]: CircleBoardComponent,
    [BoardType.Diamond]: DiamondBoardComponent,
    [BoardType.Axo]: AxoBoardComponent,
  };

  generateBoardComponent(
    viewContainerRef: ViewContainerRef,
    boardType: BoardType,
  ): BoardComponent<Board> {
    let newComponentRef = viewContainerRef.createComponent(
      this.componentMap[boardType],
    );
    const board = newComponentRef.instance;
    return <BoardComponent<Board>>board;
  }
  generateGridOptions(
    viewContainerRef: ViewContainerRef,
    board: BoardComponent<Board>,
    boardType: BoardType,
  ) {
    const gridOptions = viewContainerRef.createComponent(GridOptionComponent);

    let defaultConfigsMap = board.boardService.getDefaultConfigsMap();
    gridOptions.setInput('defaultConfigsMap', defaultConfigsMap);

    let dimensions = board.boardService.getDimensions();
    gridOptions.setInput('dimensions', dimensions);

    gridOptions.setInput('maxMinesFunction', (params: Map<string, number>) => {
      switch (boardType) {
        case BoardType.Axo:
          return 165;
        case BoardType.Classic:
        case BoardType.Toric:
          return (
            (params.get('rowsNumber') ?? 3) * (params.get('columnsNumber') ?? 3)
          );
        case BoardType.Circle:
          let radius = params.get('radius') ?? 7;
          return Math.ceil(Math.pow(radius, 2) * Math.PI);
        case BoardType.Diamond:
          let diamondRadius = params.get('radius') ?? 7;
          return (
            2 * diamondRadius * (diamondRadius - 1) + 4 * diamondRadius + 1
          );
      }
    });
  }
}
