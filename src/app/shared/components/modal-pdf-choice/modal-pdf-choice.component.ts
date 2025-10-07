import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ModalPdfChoiceData {
  title: string;
  message?: string;
  isSingleOrder?: boolean;
  orderNumber?: number;
}

export interface ModalPdfChoiceResult {
  action: 'print' | 'save' | 'cancel';
}

@Component({
  selector: 'app-modal-pdf-choice',
  templateUrl: './modal-pdf-choice.component.html',
  styleUrls: ['./modal-pdf-choice.component.css']
})
export class ModalPdfChoiceComponent {

  constructor(
    public dialogRef: MatDialogRef<ModalPdfChoiceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModalPdfChoiceData
  ) {}

  onPrint(): void {
    this.dialogRef.close({ action: 'print' } as ModalPdfChoiceResult);
  }

  onSave(): void {
    this.dialogRef.close({ action: 'save' } as ModalPdfChoiceResult);
  }

  onCancel(): void {
    this.dialogRef.close({ action: 'cancel' } as ModalPdfChoiceResult);
  }
}