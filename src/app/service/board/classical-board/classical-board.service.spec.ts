import { TestBed } from '@angular/core/testing';

import { ClassicalBoardService } from './classical-board.service';

describe('ClassicalBoardService', () => {
  let service: ClassicalBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassicalBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('generate a board', () => {
    let board = service.generateTileBoard(10, 10, 10, 'AT_FIRST_CLICK');
    expect(board.tiles).toHaveLength(10);
    board.tiles.forEach((row) => expect(row).toHaveLength(10));
    let count = 0;
    board.tiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile.isMine) count++;
      });
    });
    expect(count).toEqual(0);
  });

  it('when everyting is a mine', () => {
    let board = service.generateTileBoard(10, 10, 100, 'AT_FIRST_CLICK');
    service.finishInitialization(
      board.tiles,
      'AT_FIRST_CLICK',
      100,
      board.tiles[0][0],
    );
    board.tiles.forEach((row) => {
      row.forEach((tile) => {
        expect(tile.isMine).toBeTruthy();
      });
    });
  });
});
