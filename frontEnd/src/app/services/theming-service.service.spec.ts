import { TestBed } from '@angular/core/testing';

import { ThemingServiceService } from './theming-service.service';

describe('ThemingServiceService', () => {
  let service: ThemingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
