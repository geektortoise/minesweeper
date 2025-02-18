import { TestBed } from '@angular/core/testing';

import { TileService } from './tile.service';
import { Util } from '../../utils/util';

describe('TileService', () => {
  let service: TileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have generated tile array without mine', () => {
    let number = Util.getRandomInt(1, 100);
    let tiles = service.generateTiles(number);
    expect(tiles).toHaveLength(number);
  });

  describe('should have assigned mines', () => {
    it('should have assigned n mines', () => {
      let tiles = service.generateTiles(100);
      let minesNumber = Util.getRandomInt(10, 30);
      tiles = service.assignMines(tiles, minesNumber);
      expect(tiles.filter((tile) => tile.isMine)).toHaveLength(minesNumber);
    });

    it('should have assigned 0 mines if input is negative', () => {
      let tiles = service.generateTiles(100);
      tiles = service.assignMines(tiles, -1);
      expect(tiles.filter((tile) => tile.isMine)).toHaveLength(0);
    });

    it('should have assigned max mines', () => {
      let number = 100;
      let tiles = service.generateTiles(number);
      tiles = service.assignMines(tiles, number);
      expect(tiles.filter((tile) => tile.isMine)).toHaveLength(number);
    });

    it('should have assigned max mines if a greater input is provided', () => {
      let tiles = service.generateTiles(100);
      tiles = service.assignMines(tiles, 101);
      expect(tiles.filter((tile) => tile.isMine)).toHaveLength(100);
    });
  });

  it('should have generated tiles and incrementing id', () => {
    let tiles = [];
    tiles.push(service.generateTile());
    tiles.push(service.generateTile(true, true));
    tiles.push(service.generateTile());
    expect(tiles).toHaveLength(3);
    expect(tiles[0].id).toEqual(1);
    expect(tiles[0].isMine).toEqual(false);
    expect(tiles[1].id).toEqual(2);
    expect(tiles[1].isMine).toEqual(true);
    expect(tiles[2].id).toEqual(3);
    expect(tiles[2].isMine).toEqual(false);
  });
});
