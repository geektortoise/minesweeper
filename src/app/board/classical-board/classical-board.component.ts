import { Component, computed } from '@angular/core';
import { TileComponent } from '../../tile/tile.component';
import { AsyncPipe } from '@angular/common';
import { ClassicalBoardService } from '../../service/board/classical-board/classical-board.service';
import { BiDimensionalBoard } from '../../model/bi-dimensional-board';
import { GenerationStrategy } from '../../utils/types';
import { TimerService } from '../../service/timer/timer.service';
import { BoardComponent } from '../board.component';
import { Tile } from '../../model/tile';
import { StateService } from '../../service/state/state.service';

@Component({
  selector: 'classical-board',
  imports: [TileComponent, AsyncPipe],
  templateUrl: './classical-board.component.html',
  styleUrl: './classical-board.component.css',
})
export class ClassicalBoardComponent extends BoardComponent<BiDimensionalBoard> {
  rowsNumber = computed(
    () => this.stateService.getGameSettings()().get('rowsNumber') ?? 10,
  );
  columnsNumber = computed(
    () => this.stateService.getGameSettings()().get('columnsNumber') ?? 10,
  );

  tiles = computed(() => this.board().tiles);

  protected generationStrategy: GenerationStrategy = 'AT_FIRST_CLICK';

  constructor(
    public override boardService: ClassicalBoardService,
    protected override stateService: StateService,
    public override timerService: TimerService,
  ) {
    super(boardService, stateService, timerService);
  }

  initializeTileBoard(): BiDimensionalBoard {
    return this.boardService.generateTileBoard(
      this.rowsNumber(),
      this.columnsNumber(),
      this.minesNumber(),
      this.generationStrategy,
    );
  }

  finishInitialization(tile: Tile) {
    this.boardService.finishInitialization(
      this.board().tiles,
      this.generationStrategy,
      this.minesNumber(),
      tile,
    );
  }
}
