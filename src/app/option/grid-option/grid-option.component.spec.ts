import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridOptionComponent } from './grid-option.component';
import { getTranslocoModule } from '../../utils/transloco-testing.module';
import { GameMode } from '../../utils/types';

describe('GridOptionComponent', () => {
  let component: GridOptionComponent;
  let fixture: ComponentFixture<GridOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GridOptionComponent, getTranslocoModule()],
    }).compileComponents();

    let dimensions = [{ label: 'test', settingName: 'test', min: 1 }];
    let defaultConfigsMap = new Map<GameMode, Map<string, number>>();

    fixture = TestBed.createComponent(GridOptionComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('dimensions', dimensions);
    fixture.componentRef.setInput('defaultConfigsMap', defaultConfigsMap);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
