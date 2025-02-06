import { Component, computed, signal } from '@angular/core';
import { ClassicalBoardComponent } from '../board/classical-board/classical-board.component';
import { FormsModule } from '@angular/forms';
import { ConfettiService } from '../service/confetti/confetti.service';
import { TimerService } from '../service/timer/timer.service';
import { StorageService } from '../service/storage/storage.service';
import { HistoryComponent } from '../history/history.component';
import {
  GameMode,
  HistoryRecord,
  NotificationStatus,
  OverlayContent,
  OverlayData,
} from '../utils/types';
import { OverlayComponent } from '../overlay/overlay.component';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subject } from 'rxjs';

@Component({
  selector: 'game',
  imports: [
    ClassicalBoardComponent,
    HistoryComponent,
    FormsModule,
    FormsModule,
    OverlayComponent,
    TranslocoPipe,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent {
  result: 'NOT_STARTED' | 'ONGOING' | 'WON' | 'GAMEOVER';
  //@ViewChild('minesweeper') minesweeper!: ClassicalBoardComponent;
  boardRowsNumber = signal<number>(10);
  boardColumnsNumber = signal<number>(10);
  boardMinesNumber = signal<number>(10);

  _resetBoard = new Subject<void>();
  resetBoard = this._resetBoard.asObservable();

  maxMines = computed(() => {
    return this.boardRowsNumber() * this.boardColumnsNumber();
  });

  mode: GameMode = GameMode.BEGINNER;
  displayInputs: boolean = false;
  overlayData: OverlayData = {
    display: false,
    content: OverlayContent.HISTORY,
  };

  constructor(
    private conffetiService: ConfettiService,
    private timerService: TimerService,
    private storageService: StorageService,
  ) {}

  startNewGame(rows?: number, columns?: number, mines?: number, mode?: string) {
    if (mode) {
      this.mode = mode as GameMode;
    }
    this.result = 'NOT_STARTED';
    this.timerService.clear();
    this.conffetiService.stopConfettis(true);
    if (rows !== undefined && columns !== undefined && mines !== undefined) {
      this.boardRowsNumber.set(rows);
      this.boardColumnsNumber.set(columns);
      this.boardMinesNumber.set(mines);
    }
  }

  updateGameStatus(event: NotificationStatus) {
    if (event.status === 'WON' || event.status === 'GAMEOVER') {
      let record: HistoryRecord = {
        ...event,
        mode: this.mode,
        date: new Date(),
      };
      if (this.mode === GameMode.CUSTOM) {
        record.input = {
          row: this.boardRowsNumber(),
          column: this.boardColumnsNumber(),
          mine: this.boardMinesNumber(),
        };
      }
      this.storageService.insertHistoryRecord(record);
      if (event.status === 'WON') {
        this.conffetiService.stopConfettis(false);
        this.conffetiService.triggerConfettis();
        this.overlayData = { display: false };
      }
      if (event.status === 'GAMEOVER') {
        this.overlayData = { display: true, content: OverlayContent.EXPLOSION };
      }
      this.timerService.stop();
      this.result = event.status;
    } else if (event.status === 'ONGOING') {
      this.timerService.start();
      this.result = event.status;
    }
  }

  customGame() {
    this.mode = GameMode.CUSTOM;
    if (!this.displayInputs) {
      this.displayInputs = true;
    }
    this.boardRowsNumber.set(3);
    this.boardColumnsNumber.set(3);
    this.boardMinesNumber.set(1);
    this.startNewGame();
  }

  settings() {
    this.overlayData = { display: true, content: OverlayContent.HISTORY };
  }

  protected readonly Number = Number;
}
