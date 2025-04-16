import { Component, inject } from '@angular/core';
import { TileComponent } from '../../../tile/tile.component';
import { AsyncPipe } from '@angular/common';
import { ClassicalBoardComponent } from '../classical-board.component';
import { ToricBoardService } from '../../../service/board/classical-board/toric-board/toric-board.service';

@Component({
  selector: 'toric-board',
  imports: [TileComponent, AsyncPipe],
  templateUrl: './../classical-board.component.html',
  styleUrl: './../classical-board.component.css',
})
export class ToricBoardComponent extends ClassicalBoardComponent {
  public override boardService = inject(ToricBoardService);
}
