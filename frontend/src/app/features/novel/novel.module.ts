import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NovelRoutingModule } from './novel-routing.module';
import { NovelListComponent } from './components/novel-list/novel-list.component';
import { NovelEditorComponent } from './components/novel-editor/novel-editor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewNovelDialogComponent } from './components/novel-list/dialogs/new-novel-dialog/new-novel-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { ShareNovelDialogComponent } from './components/novel-editor/dialogs/share-novel-dialog/share-novel-dialog.component';
import { ResizableModule } from 'angular-resizable-element';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NewTagDialogComponent } from './components/novel-list/dialogs/new-tag-dialog/new-tag-dialog.component';
import { EditTagDialogComponent } from './components/novel-list/dialogs/edit-tag-dialog/edit-tag-dialog.component';

@NgModule({
  declarations: [
    NovelListComponent,
    NovelEditorComponent,
    NewNovelDialogComponent,
    NewTagDialogComponent,
    EditTagDialogComponent,
    ShareNovelDialogComponent,
  ],
  imports: [
    CommonModule,
    NovelRoutingModule,
    SharedModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ResizableModule,
    MatSlideToggleModule,
  ],
})
export class NovelModule {}
