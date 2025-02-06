import { Component, OnInit } from '@angular/core';
import { GameComponent } from './game/game.component';
import { TranslocoService } from '@jsverse/transloco';
import { StorageService } from './service/storage/storage.service';

@Component({
  selector: 'app-root',
  imports: [GameComponent],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private storageService: StorageService,
    private translocoService: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.translocoService.setActiveLang(this.storageService.getLanguage());
  }

  switchLanguage(language: string) {
    this.storageService.setLanguage(language);
    this.translocoService.setActiveLang(language);
  }
}
