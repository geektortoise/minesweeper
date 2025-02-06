import { Component, Input } from '@angular/core';
import { Tile } from '../../tile/tile';
import { TileComponent } from '../../tile/tile.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ClassicalBoardService } from '../../service/board/classical-board/classical-board.service';
import { ClassicalBoard } from './classical-board';
import { GenerationStrategy } from '../../utils/types';
import { BoardComponent } from '../board.component';
import { TimerService } from '../../service/timer/timer.service';

@Component({
  selector: 'classical-board',
  standalone: true,
  imports: [TileComponent, NgForOf, NgIf, AsyncPipe],
  templateUrl: './classical-board.component.html',
  styleUrl: './classical-board.component.css',
})
export class ClassicalBoardComponent extends BoardComponent<ClassicalBoard> {
  @Input() rowsNumber!: number;
  @Input() columnsNumber!: number;
  protected generationStrategy: GenerationStrategy = 'AT_FIRST_CLICK';

  constructor(
    protected override tileService: ClassicalBoardService,
    public override timerService: TimerService,
  ) {
    super(tileService, timerService);
  }

  initializeTileBoard(): ClassicalBoard {
    return this.tileService.generateTileBoard(
      this.rowsNumber,
      this.columnsNumber,
      this.minesNumber,
      this.generationStrategy,
    );
  }

  finishInitialization(tile: Tile) {
    this.tileService.finishInitialization(
      this.board.tiles,
      this.generationStrategy,
      this.minesNumber,
      tile,
    );
  }

  get tiles(): Tile[][] {
    return this.board.tiles;
  }
}
