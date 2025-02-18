import {
  Component,
  computed,
  effect,
  output,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { BoardService } from '../service/board/board.service';
import { TimerService } from '../service/timer/timer.service';
import { Tile } from '../model/tile';
import { Board } from '../model/board';
import { NotificationStatus } from '../utils/types';
import { StateService } from '../service/state/state.service';

@Component({
  selector: 'board',
  imports: [],
  template: '',
})
export abstract class BoardComponent<T extends Board> {
  notifyGameStatus = output<NotificationStatus>();
  restartGameEvent = output<void>();

  protected board: WritableSignal<T>;

  flagsNumber = signal<number>(0);
  gameStatus: Signal<string> = computed(() => {
    if (this.board().status == 'GAMEOVER') return 'lost';
    if (this.board().status == 'WON') return 'won';
    return 'play';
  });
  remainingMinesToDiscover = computed(
    () => this.minesNumber() - this.flagsNumber(),
  );

  private hasStarted: boolean = false;
  private firstTileRevealed: boolean = false;

  minesNumber = computed(
    () => this.stateService.getGameSettings()().get('minesNumber') ?? 18,
  );

  constructor(
    public boardService: BoardService,
    protected stateService: StateService,
    public timerService: TimerService,
  ) {
    effect(() => {
      let settings = this.stateService.getGameSettings();
      this.initializeBoard();
    });
  }

  initializeBoard() {
    let initBoard = this.initializeTileBoard();
    initBoard.status = 'ONGOING';

    if (!this.board) this.board = signal(initBoard);
    this.board.set(initBoard);
    this.hasStarted = false;
    this.firstTileRevealed = false;
    this.flagsNumber.set(0);
    this.restartGameEvent.emit();
  }

  abstract initializeTileBoard(): T;
  abstract finishInitialization(tile: Tile): void;

  handleTileClick(tile: Tile) {
    if (!tile.isEnabled) return;

    let currentBoard = this.board();
    this.start();
    if (!this.firstTileRevealed) {
      this.finishInitialization(tile);
      //this.boardService.finishInitialization(currentBoard.tiles, this.generationStrategy, this.minesNumber(), tile);
      this.firstTileRevealed = true;
    }

    if (!tile || tile.isFlagged) {
      return;
    }
    if (currentBoard.isGameOver() || currentBoard.isWon()) {
      return;
    }
    this.boardService.revealTile(currentBoard, tile);

    this.board.set(Object.create(currentBoard));
    if (currentBoard.isWon() || currentBoard.isGameOver()) {
      this.notifyGameStatus.emit({
        status: currentBoard.status,
        flagged: this.flagsNumber(),
        time: this.timerService.counter - 1,
      });
    }
  }

  onRightClick(tile: Tile) {
    if (!tile.isEnabled) return;

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
    this.initializeBoard();
  }
}
