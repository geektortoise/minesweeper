import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfettiService } from '../service/confetti/confetti.service';
import { TimerService } from '../service/timer/timer.service';
import { BoardType } from '../utils/enums';
import { BoardFactoryService } from '../service/board-factory.service';
import { BoardComponent } from '../board/board.component';
import { Board } from '../board/board';
import { CircleBoardComponent } from '../board/classical-board/circle-board.component';

@Component({
  selector: 'game',
  standalone: true,
  imports: [NgIf, DatePipe, FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements AfterViewInit {
  result: undefined | 'ONGOING' | 'WON' | 'GAMEOVER';
  // This field is required for the shaking animation
  @ViewChild('content') content!: HTMLElement;
  @ViewChild('boardSlot', { read: ViewContainerRef })
  boardSlot!: ViewContainerRef;

  minesweeper!: BoardComponent<Board>;
  boardType: BoardType = BoardType.Classic;
  playingTime: number = 0;
  displayInputs: boolean = false;

  input: { row: number; column: number; mine: number } = {
    row: 1,
    column: 1,
    mine: 1,
  };
  maxMines: number = 0;

  constructor(
    private conffetiService: ConfettiService,
    private timerService: TimerService,
    private boardFactoryService: BoardFactoryService,
  ) {}

  ngAfterViewInit() {
    this.renderDynamicBoard();
  }

  startNewGame(rows?: number, columns?: number, mines?: number) {
    if (rows !== undefined && columns !== undefined && mines !== undefined) {
      //this.minesweeper.rowsNumber = rows;
      //this.minesweeper.columnsNumber = columns;
      (<CircleBoardComponent>this.minesweeper).radius = 4;
      this.minesweeper.minesNumber = mines;
    }
    this.minesweeper.initializeBoard();
    this.result = undefined;
    this.timerService.clear();
    this.conffetiService.stopConfettis(true);
  }

  updateGameStatus(status: string) {
    if (status === 'WON' || status === 'GAMEOVER') {
      if (status === 'WON') {
        this.conffetiService.stopConfettis(false);
        this.conffetiService.triggerConfettis();
      }
      this.timerService.stop();
      this.result = status;
    } else if (status === 'ONGOING') {
      this.timerService.start();
      this.result = status;
    }
  }

  customGame() {
    if (!this.displayInputs) {
      this.displayInputs = true;
    }
    this.input.row = 3;
    this.input.column = 3;
    this.input.mine = 1;
    this.updateBoard();
  }

  updateBoard() {
    this.maxMines = this.input.row * this.input.column;
    this.startNewGame(this.input.row, this.input.column, this.input.mine);
  }

  get boardTypes(): string[] {
    return Object.keys(BoardType).filter((item) => isNaN(Number(item)));
  }

  selectBoardType(boardType: string) {
    console.log('RH ::: selectBoard');
    let type: BoardType = <BoardType>(
      BoardType[boardType as keyof typeof BoardType]
    );
    console.log(type);
    console.log(type == BoardType.Classic);
    //TODO ici. mettre dans un stateService ?
    // ou just call la methode ci dessous ?
    return;
  }

  private renderDynamicBoard() {
    let type: BoardType = BoardType.Toric; // TODO get the value
    this.boardSlot.clear();
    /*
    let componentMap:Record<BoardType, any> = {
      [BoardType.Classic]: 'ClassicalBoardComponent',
      [BoardType.Toric]: undefined,
      [BoardType.Axo]: undefined
    };

    const newComponentRef = this.boardSlot.createComponent(componentMap[type]);
    const board = newComponentRef.instance;
    if(this.boardType == BoardType.Classic) {
      (<ClassicalBoardComponent> board).rowsNumber = 10;
      (<ClassicalBoardComponent> board).columnsNumber = 10;
      (<ClassicalBoardComponent> board).minesNumber = 18;
    }

    this.minesweeper = <ClassicalBoardComponent>board;
*/

    this.minesweeper = this.boardFactoryService.generateBoardComponent(
      this.boardSlot,
      type,
    );

    this.minesweeper.notifyGameStatus.subscribe((val) =>
      this.updateGameStatus(val),
    );
    this.minesweeper.restartGameEvent.subscribe(() => this.startNewGame());

    //sais pas si utile pour moi
    // store component refs created
    //this.componentRefs.push(newComponentRef);
    // run change detection in the component and child components
    //this.cdr.detectChanges();

    // TODO destroy les subscribe si on clear ? et dans un ngOnDestroy ?
  }
}
