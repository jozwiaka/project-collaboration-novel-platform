import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyNovelDialogComponent } from './copy-novel-dialog.component';

describe('CopyNovelDialogComponent', () => {
  let component: CopyNovelDialogComponent;
  let fixture: ComponentFixture<CopyNovelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CopyNovelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CopyNovelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
