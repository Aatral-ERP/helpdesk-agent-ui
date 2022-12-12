import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadManagementCreateRoutingModule } from './lead-management-create-routing.module';
import { LeadCreateComponent } from '../../../_lead-management/lead-create/lead-create.component';
import {
  MatAutocompleteModule, MatButtonToggleModule, MatCheckboxModule, MatFormFieldModule, MatInputModule,
  MatProgressBarModule, MatSelectModule, MatSnackBarModule, MatChipsModule, MatButtonModule, MatDatepickerModule,
  MatBottomSheetModule, MatListModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxFilesizeModule } from 'ngx-filesize';
import { LeadContactCreateComponent } from '../../../_lead-management/lead-contact/lead-contact-create.component';
import { LeadDetailsUploadComponent } from '../../../_lead-management/lead-details-upload/lead-details-upload.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [LeadCreateComponent, LeadContactCreateComponent, LeadDetailsUploadComponent],
  imports: [
    CommonModule,
    LeadManagementCreateRoutingModule,
    FormsModule,
    MatSnackBarModule, MatFormFieldModule, MatProgressBarModule, MatInputModule, MatCheckboxModule,
    MatButtonToggleModule, MatSelectModule, MatAutocompleteModule, MatIconModule, MatChipsModule,
    MatButtonModule, MatDatepickerModule, MatBottomSheetModule, MatListModule,
    NgxFileDropModule,
    NgxFilesizeModule, NgMultiSelectDropDownModule
  ], entryComponents: [LeadContactCreateComponent]
})
export class LeadManagementCreateModule { }
