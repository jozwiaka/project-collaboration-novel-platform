import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-edit-tag-dialog',
  templateUrl: './edit-tag-dialog.component.html',
  styleUrls: ['./edit-tag-dialog.component.css'],
})
export class EditTagDialogComponent {
  tagName: string = '';
  errorMessage: string = '';

  constructor(
    public dialogRef: MatDialogRef<EditTagDialogComponent> // @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onEdit(): void {
    if (this.tagName.trim() === '') {
      this.errorMessage = 'Tag name cannot be empty';
    } else {
      this.dialogRef.close(this.tagName.trim());
    }
  }
}
