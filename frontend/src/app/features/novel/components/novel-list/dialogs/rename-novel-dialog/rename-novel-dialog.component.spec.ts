import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenameNovelDialogComponent } from './rename-novel-dialog.component';

describe('RenameNovelDialogComponent', () => {
  let component: RenameNovelDialogComponent;
  let fixture: ComponentFixture<RenameNovelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RenameNovelDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RenameNovelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
