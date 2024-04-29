import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovelEditorComponent } from './novel-editor.component';

describe('NovelEditorComponent', () => {
  let component: NovelEditorComponent;
  let fixture: ComponentFixture<NovelEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NovelEditorComponent],
    });
    fixture = TestBed.createComponent(NovelEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
