import { Component, computed, inject } from '@angular/core';
import { Tile } from '../../model/tile';
import { TileComponent } from '../../tile/tile.component';
import { AsyncPipe } from '@angular/common';
import { GenerationStrategy } from '../../utils/types';
import { BoardComponent } from '../board.component';
import { CircularBoardService } from '../../service/board/special-board/circular-board.service';
import { BiDimensionalBoard } from '../../model/bi-dimensional-board';

@Component({
  selector: 'circle-board',
  imports: [TileComponent, AsyncPipe],
  templateUrl: './../classical-board/classical-board.component.html',
  styleUrl: './../classical-board/classical-board.component.css',
})
export class CircleBoardComponent extends BoardComponent<BiDimensionalBoard> {
  public override boardService = inject(CircularBoardService);

  radius = computed(
    () => this.stateService.getGameSettings()().get('radius') ?? 7,
  );

  tiles = computed(() => this.board().tiles);

  private generationStrategy: GenerationStrategy = 'AT_FIRST_CLICK';

  initializeTileBoard(): BiDimensionalBoard {
    return this.boardService.generateTileBoard(
      this.radius(),
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
