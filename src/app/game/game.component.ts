import {
  AfterViewInit,
  Component,
  effect,
  Injector,
  OutputRefSubscription,
  signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConfettiService } from '../service/confetti/confetti.service';
import { TimerService } from '../service/timer/timer.service';
import { StorageService } from '../service/storage/storage.service';
import {
  BoardType,
  GameMode,
  HistoryRecord,
  NotificationStatus,
  OverlayContent,
  OverlayData,
} from '../utils/types';
import { OverlayComponent } from '../overlay/overlay.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { BoardComponent } from '../board/board.component';
import { Board } from '../model/board';
import { BoardFactoryService } from '../service/board-factory.service';
import { StateService } from '../service/state/state.service';

@Component({
  selector: 'game',
  imports: [FormsModule, FormsModule, OverlayComponent, TranslocoPipe],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css',
})
export class GameComponent implements AfterViewInit {
  @ViewChild('boardSlot', { read: ViewContainerRef })
  boardSlot!: ViewContainerRef;
  @ViewChild('gridOptionSlot', { read: ViewContainerRef })
  gridOptionSlot!: ViewContainerRef;
  minesweeper!: BoardComponent<Board>;
  boardType = signal(BoardType.Classic);

  result: 'NOT_STARTED' | 'ONGOING' | 'WON' | 'GAMEOVER';
  boardRowsNumber = signal<number>(10);
  boardColumnsNumber = signal<number>(10);
  boardMinesNumber = signal<number>(10);

  overlayData: OverlayData = {
    display: false,
    content: OverlayContent.HISTORY,
  };
  private subscriptions: OutputRefSubscription[] = [];

  constructor(
    private conffetiService: ConfettiService,
    private timerService: TimerService,
    private storageService: StorageService,
    private stateService: StateService,
    private boardFactoryService: BoardFactoryService,
    private injector: Injector,
  ) {}

  ngAfterViewInit() {
    effect(
      () => {
        this.renderDynamicBoard(this.boardType());
      },
      { injector: this.injector },
    );
  }

  startNewGame() {
    this.result = 'NOT_STARTED';
    this.timerService.clear();
    this.conffetiService.stopConfettis(true);
  }

  updateGameStatus(event: NotificationStatus) {
    if (event.status === 'WON' || event.status === 'GAMEOVER') {
      let currentBoard = this.stateService.getBoardType()();
      let currentLevel = this.stateService.getGameLevel()();
      let record: HistoryRecord = {
        ...event,
        type: currentBoard,
        level: currentLevel,
        date: new Date(),
      };
      if (currentLevel === GameMode.CUSTOM) {
        record.inputs = {
          dimensions: [...this.stateService.getGameSettings()().entries()]
            .filter(([key, _]) => key !== 'minesNumber')
            .map(([_, value]) => value),
          mines: this.stateService.getGameSettings()().get('minesNumber') ?? -1,
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

  get boardTypes(): string[] {
    return Object.values(BoardType);
  }

  selectBoardType(boardType: string) {
    let key =
      Object.keys(BoardType).find(
        (x) => BoardType[x as keyof typeof BoardType] == boardType,
      ) ?? '';
    let type: BoardType = BoardType[key as keyof typeof BoardType];
    this.boardType.set(type);
    this.stateService.setBoardType(type);
    return;
  }

  private renderDynamicBoard(type: BoardType) {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.boardSlot.clear();
    this.subscriptions = [];

    this.minesweeper = this.boardFactoryService.generateBoardComponent(
      this.boardSlot,
      type,
    );

    this.subscriptions.push(
      this.minesweeper.notifyGameStatus.subscribe((val) =>
        this.updateGameStatus(val),
      ),
    );
    this.subscriptions.push(
      this.minesweeper.restartGameEvent.subscribe(() => this.startNewGame()),
    );

    this.gridOptionSlot.clear();

    this.boardFactoryService.generateGridOptions(
      this.gridOptionSlot,
      this.minesweeper,
      type,
    );
  }

  settings() {
    this.overlayData = { display: true, content: OverlayContent.HISTORY };
  }

  protected readonly Number = Number;
}
