import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Tile } from '../tile/tile';
import { TileComponent } from '../tile/tile.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { BoardService } from '../service/board/board.service';
import { Board } from './board';
import { TimerService } from '../service/timer/timer.service';

@Component({
  selector: 'classical-board',
  standalone: true,
  imports: [TileComponent, NgForOf, NgIf, AsyncPipe],
  template: '',
  //templateUrl: './classical-board/classical-board.component.html',
  //styleUrl: './classical-board/classical-board.component.css',
})
export abstract class BoardComponent<T extends Board> implements OnInit {
  @Input() minesNumber!: number;
  @Output() notifyGameStatus: EventEmitter<string> = new EventEmitter();
  @Output() restartGameEvent: EventEmitter<void> = new EventEmitter();
  board!: T;
  flagsNumber: number = 0;
  private hasStarted: boolean = false;
  private firstTileRevealed: boolean = false;

  constructor(
    protected tileService: BoardService,
    public timerService: TimerService,
  ) {}

  ngOnInit(): void {
    this.initializeBoard();
  }

  initializeBoard() {
    this.board = this.initializeTileBoard();
    this.board.status = 'ONGOING';
    this.hasStarted = false;
    this.firstTileRevealed = false;
    this.flagsNumber = 0;
  }

  abstract initializeTileBoard(): T;
  abstract finishInitialization(tile: Tile): void;

  handleTileClick(tile: Tile) {
    if (!tile.isEnabled) return;

    this.start();
    if (!this.firstTileRevealed) {
      this.finishInitialization(tile);
      this.firstTileRevealed = true;
    }

    if (!tile || tile.isFlagged) {
      return;
    }
    if (this.board.isGameOver() || this.board.isWon()) {
      return;
    }
    this.tileService.revealTile(this.board, tile);

    if (this.board.isWon() || this.board.isGameOver()) {
      this.notifyGameStatus.emit(this.board.status);
    }
  }

  onRightClick(tile: Tile) {
    if (!tile.isEnabled) return;

    this.start();

    if (tile.isRevealed) return false;
    tile.isFlagged = !tile.isFlagged;
    if (tile.isFlagged) this.flagsNumber++;
    else this.flagsNumber--;
    return false;
  }

  private start() {
    if (!this.hasStarted) {
      this.hasStarted = true;
      this.notifyGameStatus.emit('ONGOING');
    }
  }

  getGameStatus(): string {
    if (this.board.status == 'GAMEOVER') return 'lost';
    if (this.board.status == 'WON') return 'won';
    return 'play';
  }

  restartGame() {
    this.restartGameEvent.emit();
  }
}
