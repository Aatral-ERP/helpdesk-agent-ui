import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material';
import { TermsAndConditionsComponent } from 'src/app/_sales/terms-and-conditions/terms-and-conditions.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TermsAndConditionsComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatProgressBarModule
  ], exports: [TermsAndConditionsComponent]
})
export class TermsAndConditionsModule { }
