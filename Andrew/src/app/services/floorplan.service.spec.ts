import { TestBed } from '@angular/core/testing';

import { FloorplanService } from './floorplan.service';

describe('FloorplanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FloorplanService = TestBed.get(FloorplanService);
    expect(service).toBeTruthy();
  });
});
