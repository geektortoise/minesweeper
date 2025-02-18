import { Component, input } from '@angular/core';
import { Tile } from '../model/tile';

@Component({
  selector: 'tile',
  imports: [],
  templateUrl: './tile.component.html',
  styleUrl: './tile.component.css',
})
export class TileComponent {
  tile = input.required<Tile>();
}
