import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Novel } from 'src/app/features/novel/models/novel.model';
import { Tag } from 'src/app/features/novel/models/tag.model';
import { CopiedNovelData } from '../../interfaces/copied-novel-data.interface';

@Component({
  selector: 'app-copy-novel-dialog',
  templateUrl: './copy-novel-dialog.component.html',
  styleUrls: ['./copy-novel-dialog.component.css'],
})
export class CopyNovelDialogComponent {
  newNovelTitle: string = '';
  errorMessage: string = '';
  tags: Tag[];

  constructor(
    public dialogRef: MatDialogRef<CopyNovelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CopiedNovelData
  ) {
    this.newNovelTitle = data.newNovelTitle + ' (Copy)';
    this.tags = data.tags;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCopy(): void {
    if (this.newNovelTitle.trim() === '') {
      this.errorMessage = 'Novel name cannot be empty';
    } else {
      this.dialogRef.close({
        newNovelTitle: this.newNovelTitle,
        tags: this.tags,
      });
    }
  }

  untagCopiedNovel(tag: Tag) {
    this.tags = this.tags.filter((t) => t.id !== tag.id);
  }
}
