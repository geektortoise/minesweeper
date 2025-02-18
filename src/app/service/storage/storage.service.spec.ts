import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage.service';
import { getTranslocoModule } from '../../utils/transloco-testing.module';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [getTranslocoModule()],
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
