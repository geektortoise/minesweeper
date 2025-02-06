export class Tile {
  // Id of the tile
  id: number;
  // Whether or not the tile is revealed
  isRevealed: boolean;
  // Whether or not the tile is a mine
  isMine: boolean;
  // Whether or not the tile has been flagged as a mine by the player
  isFlagged: boolean;
  // the neighboorhood
  neighbors: Tile[];
  isEnabled: boolean;

  constructor(id: number, isMine: boolean) {
    this.id = id;
    this.isMine = isMine;
    this.isRevealed = false;
    this.isFlagged = false;
    this.neighbors = [];
    this.isEnabled = true;
  }

  getThreatCount(): number {
    return this.neighbors.filter((tile) => tile.isMine).length;
  }
}
