import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { Tile } from '../../tile/tile';
import { TileComponent } from '../../tile/tile.component';
import { AsyncPipe } from '@angular/common';
import { ClassicalBoardService } from '../../service/classical-board/classical-board.service';
import { ClassicalBoard } from './classical-board';
import { GenerationStrategy, NotificationStatus } from '../../utils/types';
import { TimerService } from '../../service/timer/timer.service';
import { isEqual } from 'lodash';
import { Observable } from 'rxjs';

@Component({
  selector: 'classical-board',
  imports: [TileComponent, AsyncPipe],
  templateUrl: './classical-board.component.html',
  styleUrl: './classical-board.component.css',
})
export class ClassicalBoardComponent {
  rowsNumber = input.required<number>();
  columnsNumber = input.required<number>();
  minesNumber = input.required<number>();

  notifyGameStatus = output<NotificationStatus>();
  restartGameEvent = output<void>();

  private board: WritableSignal<ClassicalBoard> = signal(
    this.boardService.getDefaultEmptyBoard() /*{
    equal: (a, b) => {
      console.log('RH in equality check');
      console.log('a = '+a.status);
      console.log('b = '+b.status);
      return isEqual(a, b);
    },
  }*/,
  );
  //(a, b) => JSON.stringify(a) === JSON.stringify(b),
  tiles = computed(() => this.board().tiles);
  flagsNumber = signal<number>(0);
  remainingMinesToDiscover = computed(
    () => this.minesNumber() - this.flagsNumber(),
  );

  private hasStarted: boolean = false;
  private firstTileRevealed: boolean = false;
  private generationStrategy: GenerationStrategy = 'AT_FIRST_CLICK';

  gameStatus: Signal<string> = computed(() => {
    console.log('update GameStatus signal ' + this.board().status);
    if (this.board().status == 'GAMEOVER') return 'lost';
    if (this.board().status == 'WON') return 'won';
    return 'play';
  });

  constructor(
    private boardService: ClassicalBoardService,
    public timerService: TimerService,
  ) {
    effect(() => {
      console.log('this.initializeBoard');
      console.log(
        this.rowsNumber() +
          '-' +
          this.columnsNumber() +
          '-' +
          this.minesNumber(),
      );
      this.initializeBoard(
        this.rowsNumber(),
        this.columnsNumber(),
        this.minesNumber(),
      );
    });
  }

  initializeBoard(
    rowsNumber: number,
    columnsNumber: number,
    minesNumber: number,
  ) {
    let initBoard = this.boardService.generateTileBoard(
      rowsNumber,
      columnsNumber,
      minesNumber,
      this.generationStrategy,
    );
    initBoard.status = 'ONGOING';

    this.board.set(initBoard);
    this.hasStarted = false;
    this.firstTileRevealed = false;
    this.flagsNumber.set(0);
  }

  handleTileClick(tile: Tile) {
    console.log('handleTileClick');
    let currentBoard = this.board();
    console.log('currentBoard = ' + currentBoard.id);
    console.log('currentBoard = ' + currentBoard.status);
    console.log('currentBoard = ' + currentBoard.isWon());
    this.start();
    if (!this.firstTileRevealed) {
      this.boardService.finishInitialization(
        currentBoard.tiles,
        this.generationStrategy,
        this.minesNumber(),
        tile,
      );
      this.firstTileRevealed = true;
    }
    if (!tile || tile.isFlagged) {
      return;
    }
    if (currentBoard.isGameOver() || currentBoard.isWon()) {
      return;
    }
    console.log('handleTileClick : old status6 ' + this.board().status);
    this.boardService.revealTile(currentBoard, tile);

    console.log('handleTileClick : old status7 ' + this.board().status);
    console.log('handleTileClick : set board ');
    this.board.set(Object.create(currentBoard));
    console.log('handleTileClick : status ' + currentBoard.status);
    console.log(
      'handleTileClick : currentBoard.isWon() ' + currentBoard.isWon(),
    );
    if (currentBoard.isWon() || currentBoard.isGameOver()) {
      this.notifyGameStatus.emit({
        status: currentBoard.status,
        flagged: this.flagsNumber(),
        time: this.timerService.counter - 1,
      });
    }
  }

  onRightClick(tile: Tile) {
    this.start();

    if (tile.isRevealed) return false;
    tile.isFlagged = !tile.isFlagged;
    if (tile.isFlagged) this.flagsNumber.update((flagNumber) => ++flagNumber);
    else this.flagsNumber.update((flagNumber) => --flagNumber);
    return false;
  }

  private start() {
    if (!this.hasStarted) {
      this.hasStarted = true;
      this.notifyGameStatus.emit({
        status: 'ONGOING',
        flagged: this.flagsNumber(),
        time: this.timerService.counter,
      });
    }
  }

  restartGame() {
    this.restartGameEvent.emit();
    this.initializeBoard(
      this.rowsNumber(),
      this.columnsNumber(),
      this.minesNumber(),
    );
  }
}
