import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeadOverviewRoutingModule } from './lead-overview-routing.module';
import { MatProgressBarModule, MatIconModule, MatTabsModule, MatDatepickerModule, MatInputModule, MatDialogModule, MatExpansionModule, MatTableModule, MatSortModule, MatMenuModule, MatCheckboxModule } from '@angular/material';
import { LeadOverviewComponent } from 'src/app/_lead-management/lead-overview/lead-overview.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxFilesizeModule } from 'ngx-filesize';
import { LeadTaskComponent } from '../../../_lead-management/lead-task/lead-task.component';
import { LeadMeetingComponent } from '../../../_lead-management/lead-meeting/lead-meeting.component';
import { LeadActivitiesComponent } from '../../../_lead-management/lead-activities/lead-activities.component';
import { FormsModule } from '@angular/forms';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { LeadDetailsMailComponent } from '../../../_lead-management/lead-details-mail/lead-details-mail.component';

@NgModule({
  declarations: [LeadOverviewComponent, LeadTaskComponent, LeadMeetingComponent, LeadActivitiesComponent, LeadDetailsMailComponent],
  imports: [
    CommonModule,
    LeadOverviewRoutingModule,
    NgxFileDropModule, NgxFilesizeModule, MatCheckboxModule,
    MatProgressBarModule, MatIconModule, MatTabsModule, FormsModule, MatDatepickerModule,
    MatInputModule, MatDialogModule, MatTableModule, MatSortModule, NgxMatDatetimePickerModule,
    MatMenuModule, MatExpansionModule,
    NgxMatTimepickerModule, NgxMatNativeDateModule,
  ],
  entryComponents: [LeadTaskComponent, LeadMeetingComponent]
})
export class LeadOverviewModule { }
