import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNovelDialogComponent } from './new-novel-dialog.component';

describe('NewNovelDialogComponent', () => {
  let component: NewNovelDialogComponent;
  let fixture: ComponentFixture<NewNovelDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewNovelDialogComponent],
    });
    fixture = TestBed.createComponent(NewNovelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
