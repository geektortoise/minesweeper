import { Component, input, InputSignal } from '@angular/core';
import { Tile } from './tile';

@Component({
  selector: 'tile',
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css',
})
export class TileComponent {
  tile = input.required<Tile>();
}
