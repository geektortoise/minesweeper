import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { HistoryComponent } from '../history/history.component';
import { CommonModule } from '@angular/common';
import { OverlayContent, OverlayData } from '../utils/types';

@Component({
  selector: 'overlay',
  imports: [HistoryComponent, CommonModule],
  templateUrl: './overlay.component.html',
  styleUrl: './overlay.component.css',
})
export class OverlayComponent {
  @Input() overlayData: OverlayData;

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event && event.key === 'Escape') {
      this.off();
    }
  }

  public get overlayContent(): typeof OverlayContent {
    return OverlayContent;
  }

  off() {
    this.overlayData.display = false;
  }
}
