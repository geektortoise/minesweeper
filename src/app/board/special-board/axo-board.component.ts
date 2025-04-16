import { Component, computed, inject } from '@angular/core';
import { TileComponent } from '../../tile/tile.component';
import { AsyncPipe } from '@angular/common';
import { GenerationStrategy } from '../../utils/types';
import { BoardComponent } from '../board.component';
import { AxoBoardService } from '../../service/board/special-board/axo-board.service';
import { Tile } from '../../model/tile';
import { BiDimensionalBoard } from '../../model/bi-dimensional-board';

@Component({
  selector: 'axo-board',
  imports: [TileComponent, AsyncPipe],
  templateUrl: './../classical-board/classical-board.component.html',
  styleUrl: './../classical-board/classical-board.component.css',
})
export class AxoBoardComponent extends BoardComponent<BiDimensionalBoard> {
  public override boardService = inject(AxoBoardService);

  tiles = computed(() => this.board().tiles);

  private generationStrategy: GenerationStrategy = 'AT_FIRST_CLICK';

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
