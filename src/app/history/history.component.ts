import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/storage/storage.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { HistoryRecord } from '../utils/types';

@Component({
  selector: 'history',
  imports: [DatePipe, TranslocoPipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  history!: Array<HistoryRecord>;

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    this.history = this.storageService.getHistory();
  }
}
