import { Component, Input } from '@angular/core';
import { Tile } from '../../tile/tile';
import { TileComponent } from '../../tile/tile.component';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ClassicalBoardService } from '../../service/board/classical-board/classical-board.service';
import { ClassicalBoard } from './classical-board';
import { GenerationStrategy } from '../../utils/types';
import { BoardComponent } from '../board.component';
import { TimerService } from '../../service/timer/timer.service';
import { ClassicalBoardComponent } from './classical-board.component';
import { ToricBoardService } from '../../service/board/classical-board/toric-board.service';

@Component({
  selector: 'classical-board',
  standalone: true,
  imports: [TileComponent, NgForOf, NgIf, AsyncPipe],
  templateUrl: './classical-board.component.html',
  styleUrl: './classical-board.component.css',
})
export class ToricBoardComponent extends ClassicalBoardComponent {
  constructor(
    protected override tileService: ToricBoardService,
    public override timerService: TimerService,
  ) {
    super(tileService, timerService);
  }
}
