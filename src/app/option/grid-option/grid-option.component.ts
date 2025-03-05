import { Component, computed, effect, input, signal } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { StateService } from '../../service/state/state.service';
import { GameMode, GridDimensionOption } from '../../utils/types';

@Component({
  selector: 'grid-option',
  imports: [TranslocoPipe],
  templateUrl: './grid-option.component.html',
  styleUrl: './grid-option.component.css',
})
export class GridOptionComponent {
  dimensions = input.required<GridDimensionOption[]>();
  defaultConfigsMap = input.required<Map<GameMode, Map<string, number>>>();
  maxMinesFunction = input.required<(arg0: Map<string, number>) => number>();

  displayInputs = signal(false);
  gridOptions = signal<Map<string, number>>(new Map<string, number>());
  maxMines = computed(() =>
    this.maxMinesFunction().call(this.gridOptions(), this.gridOptions()),
  );

  constructor(
    private translocoService: TranslocoService,
    private stateService: StateService,
  ) {
    effect(() => {
      this.stateService.setGameSettings(this.gridOptions());
    });
  }

  setDimensionsFromLevel(level: GameMode) {
    let dimensions = this.defaultConfigsMap().get(level);
    if (dimensions) {
      const gameSettings = new Map<string, number>(dimensions);
      this.gridOptions.set(gameSettings);
    }
    this.displayInputs.set(false);
    this.stateService.setGameLevel(level);
  }

  updateDimension(settingName: string, value: number) {
    const gameSettings = new Map<string, number>(this.gridOptions());
    const relatedDimension = this.dimensions().find(
      (dim) => dim.settingName === settingName,
    );
    if (!value) value = relatedDimension?.min ?? 3;

    if (relatedDimension?.max && value > relatedDimension?.max)
      value = relatedDimension?.max;
    gameSettings.set(settingName, value);
    this.gridOptions.set(gameSettings);
  }

  enableCustomOptions() {
    if (!this.displayInputs()) {
      this.displayInputs.set(true);
    }
    const gameSettings = new Map<string, number>();
    for (let dim of this.dimensions()) {
      gameSettings.set(dim.settingName, dim.min);
    }
    this.gridOptions.set(gameSettings);
    this.stateService.setGameLevel(GameMode.CUSTOM);
  }
}
