import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-rename-novel-dialog',
  templateUrl: './rename-novel-dialog.component.html',
  styleUrls: ['./rename-novel-dialog.component.css'],
})
export class RenameNovelDialogComponent {
  newNovelName: string = '';
  errorMessage: string = '';

  constructor(public dialogRef: MatDialogRef<RenameNovelDialogComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onRename(): void {
    if (this.newNovelName.trim() === '') {
      this.errorMessage = 'Novel name cannot be empty';
    } else {
      this.dialogRef.close(this.newNovelName.trim());
    }
  }
}
