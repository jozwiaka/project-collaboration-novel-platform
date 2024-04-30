import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-new-tag-dialog',
  templateUrl: './new-tag-dialog.component.html',
  styleUrls: ['./new-tag-dialog.component.css'],
})
export class NewTagDialogComponent {
  tagName: string = '';
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<NewTagDialogComponent> // @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.tagName.trim() === '') {
      this.errorMessage = 'Tag name cannot be empty';
    } else {
      this.dialogRef.close(this.tagName.trim());
    }
  }
}
