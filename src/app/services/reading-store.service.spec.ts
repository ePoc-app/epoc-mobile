import { TestBed } from '@angular/core/testing';

import { ReadingStoreService } from './reading-store.service';

describe('ReadingStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadingStoreService = TestBed.get(ReadingStoreService);
    expect(service).toBeTruthy();
  });
});
