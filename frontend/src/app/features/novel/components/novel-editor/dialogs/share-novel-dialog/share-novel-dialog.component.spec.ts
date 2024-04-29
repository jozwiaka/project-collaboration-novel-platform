import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareNovelDialogComponent } from './share-novel-dialog.component';

describe('ShareNovelDialogComponent', () => {
  let component: ShareNovelDialogComponent;
  let fixture: ComponentFixture<ShareNovelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShareNovelDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareNovelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
