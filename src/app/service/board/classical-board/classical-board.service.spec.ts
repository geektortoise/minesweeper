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
});
