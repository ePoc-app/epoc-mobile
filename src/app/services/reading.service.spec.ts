import { TestBed } from '@angular/core/testing';

import { ReadingService } from './reading.service';

describe('ReadingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReadingService = TestBed.get(ReadingService);
    expect(service).toBeTruthy();
  });
});
