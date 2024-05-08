import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-copy-novel-dialog',
  templateUrl: './copy-novel-dialog.component.html',
  styleUrls: ['./copy-novel-dialog.component.css'],
})
export class CopyNovelDialogComponent {
  novelName: string = '';
  errorMessage: string = '';

  constructor(public dialogRef: MatDialogRef<CopyNovelDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.novelName.trim() === '') {
      this.errorMessage = 'Novel name cannot be empty';
    } else {
      this.dialogRef.close(this.novelName.trim());
    }
  }
}
