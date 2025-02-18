import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassicalBoardComponent } from './classical-board.component';
import { StateService } from '../../service/state/state.service';

describe('ClassicalBoardComponent', () => {
  let component: ClassicalBoardComponent;
  let fixture: ComponentFixture<ClassicalBoardComponent>;
  let yearQuartersOutputSpy;
  let stateService: StateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassicalBoardComponent],
    }).compileComponents();
    stateService = TestBed.inject(StateService);

    fixture = TestBed.createComponent(ClassicalBoardComponent);
    component = fixture.componentInstance;

    let options = new Map<string, number>();
    options.set('rowsNumber', 10);
    options.set('columnsNumber', 10);
    options.set('minesNumber', 10);
    stateService.setGameSettings(options);

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
    stateService.setGameSettings(
      new Map<string, number>(stateService.getGameSettings()()).set(
        'minesNumber',
        0,
      ),
    );
    fixture.detectChanges();
    yearQuartersOutputSpy = jest.spyOn(component.notifyGameStatus, 'emit');

    component.handleTileClick(component.tiles()[0][0]);

    expect(yearQuartersOutputSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'ONGOING' }),
    );
    expect(yearQuartersOutputSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'WON' }),
    );
  });

  it('check defeat', () => {
    stateService.setGameSettings(
      new Map<string, number>(stateService.getGameSettings()()).set(
        'minesNumber',
        100,
      ),
    );
    fixture.detectChanges();
    yearQuartersOutputSpy = jest.spyOn(component.notifyGameStatus, 'emit');

    component.handleTileClick(component.tiles()[0][0]);

    expect(yearQuartersOutputSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'ONGOING' }),
    );
    expect(yearQuartersOutputSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'GAMEOVER' }),
    );
  });
});
