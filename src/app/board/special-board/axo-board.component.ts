import { Component, computed } from '@angular/core';
import { TileComponent } from '../../tile/tile.component';
import { AsyncPipe } from '@angular/common';
import { GenerationStrategy } from '../../utils/types';
import { BoardComponent } from '../board.component';
import { TimerService } from '../../service/timer/timer.service';
import { AxoBoardService } from '../../service/board/special-board/axo-board.service';
import { Tile } from '../../model/tile';
import { BiDimensionalBoard } from '../../model/bi-dimensional-board';
import { StateService } from '../../service/state/state.service';

@Component({
  selector: 'axo-board',
  imports: [TileComponent, AsyncPipe],
  templateUrl: './../classical-board/classical-board.component.html',
  styleUrl: './../classical-board/classical-board.component.css',
})
export class AxoBoardComponent extends BoardComponent<BiDimensionalBoard> {
  tiles = computed(() => this.board().tiles);

  private generationStrategy: GenerationStrategy = 'AT_FIRST_CLICK';

  constructor(
    public override boardService: AxoBoardService,
    protected override stateService: StateService,
    public override timerService: TimerService,
  ) {
    super(boardService, stateService, timerService);
  }

  initializeTileBoard(): BiDimensionalBoard {
    return this.boardService.generateTileBoard(
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
