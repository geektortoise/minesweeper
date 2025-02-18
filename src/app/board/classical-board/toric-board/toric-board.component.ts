import { Component } from '@angular/core';
import { TileComponent } from '../../../tile/tile.component';
import { AsyncPipe } from '@angular/common';
import { TimerService } from '../../../service/timer/timer.service';
import { ClassicalBoardComponent } from '../classical-board.component';
import { ToricBoardService } from '../../../service/board/classical-board/toric-board/toric-board.service';
import { StateService } from '../../../service/state/state.service';

@Component({
  selector: 'toric-board',
  imports: [TileComponent, AsyncPipe],
  templateUrl: './../classical-board.component.html',
  styleUrl: './../classical-board.component.css',
})
export class ToricBoardComponent extends ClassicalBoardComponent {
  constructor(
    public override boardService: ToricBoardService,
    protected override stateService: StateService,
    public override timerService: TimerService,
  ) {
    super(boardService, stateService, timerService);
  }
}
