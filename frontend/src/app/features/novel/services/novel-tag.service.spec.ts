import { TestBed } from '@angular/core/testing';

import { NovelTagService } from './novel-tag.service';

describe('NovelTagService', () => {
  let service: NovelTagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NovelTagService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
