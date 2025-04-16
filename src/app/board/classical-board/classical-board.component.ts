import { Component, computed, inject } from '@angular/core';
import { TileComponent } from '../../tile/tile.component';
import { AsyncPipe } from '@angular/common';
import { ClassicalBoardService } from '../../service/board/classical-board/classical-board.service';
import { BiDimensionalBoard } from '../../model/bi-dimensional-board';
import { GenerationStrategy } from '../../utils/types';
import { BoardComponent } from '../board.component';
import { Tile } from '../../model/tile';

@Component({
  selector: 'classical-board',
  imports: [TileComponent, AsyncPipe],
  templateUrl: './classical-board.component.html',
  styleUrl: './classical-board.component.css',
})
export class ClassicalBoardComponent extends BoardComponent<BiDimensionalBoard> {
  public override boardService = inject(ClassicalBoardService);

  rowsNumber = computed(
    () => this.stateService.getGameSettings()().get('rowsNumber') ?? 10,
  );
  columnsNumber = computed(
    () => this.stateService.getGameSettings()().get('columnsNumber') ?? 10,
  );

  tiles = computed(() => this.board().tiles);

  protected generationStrategy: GenerationStrategy = 'AT_FIRST_CLICK';

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
