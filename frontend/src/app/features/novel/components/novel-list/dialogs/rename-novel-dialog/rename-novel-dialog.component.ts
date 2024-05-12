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
  oldNovelName: string = '';
  newNovelName: string = '';
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<RenameNovelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    this.newNovelName = data;
    this.oldNovelName = data;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  canRename(): boolean {
    return this.newNovelName.trim() === this.oldNovelName.trim();
  }

  onRename(): void {
    if (this.newNovelName.trim() === '') {
      this.errorMessage = 'Novel name cannot be empty';
    } else {
      this.dialogRef.close(this.newNovelName.trim());
    }
  }
}
