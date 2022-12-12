import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadMailTemplatesRoutingModule } from './lead-mail-templates-routing.module';
import { LeadMailTemplatesComponent } from '../../../_lead-management/lead-mail-templates/lead-mail-templates.component';
import { LeadMailSettingsComponent } from '../../../_lead-management/lead-mail-settings/lead-mail-settings.component';
import { MatFormFieldModule, MatInputModule, MatProgressBarModule, MatSelectModule, MatDialogModule, MatButtonModule, MatRadioModule, MatSlideToggleModule, MatIconModule } from '@angular/material';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FormsModule } from '@angular/forms';
import { LeadMailTemplateCreateComponent } from 'src/app/_lead-management/lead-mail-template-create/lead-mail-template-create.component';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridButtonRendererModule } from '../../common/ag-grid-button-renderer.module';
import { AGGridButtonRendererComponent } from '../../common/ag-grid-button-renderer.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LeadMailSentStatusComponent } from '../../../_lead-management/lead-mail-sent-status/lead-mail-sent-status.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxFilesizeModule } from 'ngx-filesize';

@NgModule({
  declarations: [LeadMailTemplatesComponent, LeadMailSettingsComponent,
    LeadMailTemplateCreateComponent, LeadMailSentStatusComponent],
  imports: [
    CommonModule,
    LeadMailTemplatesRoutingModule,
    AngularEditorModule,
    FormsModule,
    AngularMyDatePickerModule, NgxFileDropModule, NgxFilesizeModule,
    MatInputModule, MatProgressBarModule, MatFormFieldModule, MatSelectModule, MatDialogModule,
    MatButtonModule, MatRadioModule, MatSlideToggleModule, MatIconModule,
    AgGridModule.withComponents([AGGridButtonRendererComponent]),
    AgGridButtonRendererModule,
    NgxSkeletonLoaderModule,
  ],
  entryComponents: [LeadMailTemplateCreateComponent]
})
export class LeadMailTemplatesModule { }
