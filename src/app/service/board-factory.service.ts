import { Injectable, Type, ViewContainerRef } from '@angular/core';
import { BoardType } from '../utils/enums';
import { ClassicalBoardComponent } from '../board/classical-board/classical-board.component';
import { CircleBoardComponent } from '../board/classical-board/circle-board.component';
import { BoardComponent } from '../board/board.component';
import { Board } from '../board/board';
import { DiamondBoardComponent } from '../board/classical-board/diamond-board.component';
import { AxoBoardComponent } from '../board/classical-board/axo-board.component';
import { ToricBoardComponent } from '../board/classical-board/toric-board.component';

@Injectable({
  providedIn: 'root',
})
export class BoardFactoryService {
  componentMap: Record<BoardType, any> = {
    //TODO change to a BOARD parent class
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
    const newComponentRef = viewContainerRef.createComponent(
      this.componentMap[boardType],
    );
    const board = newComponentRef.instance;
    if (boardType == BoardType.Classic || boardType == BoardType.Toric) {
      (<ClassicalBoardComponent>board).rowsNumber = 10;
      (<ClassicalBoardComponent>board).columnsNumber = 10;
      (<ClassicalBoardComponent>board).minesNumber = 18;
    } else if (
      boardType == BoardType.Circle ||
      boardType == BoardType.Diamond
    ) {
      (<CircleBoardComponent>board).radius = 7;
      (<CircleBoardComponent>board).minesNumber = 10;
    } else if (boardType == BoardType.Axo) {
      (<AxoBoardComponent>board).minesNumber = 10;
    }
    return <BoardComponent<Board>>board;
  }
}

//NEXT TODO : Voir les méthodes qui peuvent etre mutualisée. Bcp pevent etre dans classicalbpard et etre appellée
//tester
//voir comment réintégrer les options de taille de grille en fonction du board (un circleboard aura juste un rayon)
