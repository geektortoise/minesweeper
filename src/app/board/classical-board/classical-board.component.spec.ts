import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicalBoardComponent } from './classical-board.component';

describe('ClassicalBoardComponent', () => {
  let component: ClassicalBoardComponent;
  let fixture: ComponentFixture<ClassicalBoardComponent>;
  let gameStatusOutputSpy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassicalBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassicalBoardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rowsNumber', '10');
    fixture.componentRef.setInput('columnsNumber', '10');
    fixture.componentRef.setInput('minesNumber', '10');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('check board dimensions', () => {
    let tiles = component.tiles();
    expect(tiles).toHaveLength(10);
    tiles.forEach((row) => expect(row).toHaveLength(10));
  });

  it('check mines number before clicking', () => {
    let tiles = component.tiles();
    let count = 0;
    tiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile.isMine) count++;
      });
    });
    expect(count).toEqual(0);
  });

  it('check mines number after clicking', () => {
    let tiles = component.tiles();

    component.handleTileClick(tiles[0][0]);

    let count = 0;
    tiles.forEach((row) => {
      row.forEach((tile) => {
        if (tile.isMine) count++;
      });
    });
    expect(count).toEqual(10);
  });

  it('check victory', () => {
    fixture.componentRef.setInput('minesNumber', '0');
    fixture.detectChanges();
    gameStatusOutputSpy = jest.spyOn(component.notifyGameStatus, 'emit');

    component.handleTileClick(component.tiles()[0][0]);

    expect(gameStatusOutputSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'ONGOING' }),
    );
    expect(gameStatusOutputSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'WON' }),
    );
  });

  it('check defeat', () => {
    fixture.componentRef.setInput('minesNumber', '100');
    fixture.detectChanges();
    gameStatusOutputSpy = jest.spyOn(component.notifyGameStatus, 'emit');

    component.handleTileClick(component.tiles()[0][0]);

    expect(gameStatusOutputSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'ONGOING' }),
    );
    expect(gameStatusOutputSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'GAMEOVER' }),
    );
  });
});
