import { Board } from './board';
import { Tile } from './tile';

export class BiDimensionalBoard extends Board {
  // the representation of the tiles on the board
  tiles: Tile[][];
  numberOfMinesLeft: number;
  numberOfUnRevealedTiles: number = 0;

  constructor(id: number, numberOfMinesLeft: number) {
    super(id);
    this.tiles = [];
    this.numberOfMinesLeft = numberOfMinesLeft;
  }
}
