import { TestBed } from '@angular/core/testing';

import { BiDimensionalBoardService } from './bi-dimensional-board.service';
import { TileService } from '../tile/tile.service';
import { Tile } from '../../model/tile';

describe('BiDimensionalBoardService', () => {
  let service: BiDimensionalBoardService;
  let tileService: TileService;
  let tiles: Tile[][];

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BiDimensionalBoardService);
    tileService = TestBed.inject(TileService);

    tiles = [];
    for (let i = 0; i < 3; i++) {
      tiles[i] = [];
      for (let j = 0; j < 3; j++) {
        tiles[i].push(tileService.generateTile());
      }
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('square board should have a square tile number', () => {
    expect(service.getTilesNumber(tiles)).toEqual(9);
  });

  it('getTilesNumber is not impacted by number of mines', () => {
    tiles[0][0].isMine = true;
    tiles[1][2].isMine = true;
    expect(service.getTilesNumber(tiles)).toEqual(9);
  });

  it('getNeighbors', () => {
    expect(service.getNeighbors(tiles, 0, 0)).toHaveLength(3);
    expect(service.getNeighbors(tiles, 1, 1)).toHaveLength(8);
    expect(service.getNeighbors(tiles, 1, 2)).toHaveLength(5);
  });
});
