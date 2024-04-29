import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-new-novel-dialog',
  templateUrl: './new-novel-dialog.component.html',
  styleUrls: ['./new-novel-dialog.component.css'],
})
export class NewNovelDialogComponent {
  novelName: string = '';
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<NewNovelDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

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
