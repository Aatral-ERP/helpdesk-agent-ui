import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreambleComponent } from '../../../_sales/preamble/preamble.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { MatProgressBarModule } from '@angular/material';

@NgModule({
  declarations: [PreambleComponent],
  imports: [
    CommonModule,
    PdfViewerModule,
    MatProgressBarModule
  ], exports: [PreambleComponent]
})
export class PreambleModule { }
