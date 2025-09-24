import { TestBed } from '@angular/core/testing';

import { Sede } from './sede';

describe('Sede', () => {
  let service: Sede;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Sede);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
