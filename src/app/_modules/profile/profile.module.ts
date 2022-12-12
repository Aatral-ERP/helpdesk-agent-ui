import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { MatButtonModule, MatChipsModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatButtonToggleModule, MatProgressBarModule, MatSelectModule, MatTabsModule } from '@angular/material';
import { AgentProfileComponent } from 'src/app/_profile/agent-profile/agent-profile.component';
import { ApplyLeaveComponent } from '../../_profile/apply-leave/apply-leave.component';
import { FormsModule } from '@angular/forms';
import { AppliedLeaveComponent } from '../../_profile/applied-leave/applied-leave.component';

import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { AgentLedgerComponent } from 'src/app/_tickets/agent-ledger/agent-ledger.component';


@NgModule({
  declarations: [AgentProfileComponent, ApplyLeaveComponent, AppliedLeaveComponent, AgentLedgerComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule,
    MatChipsModule, MatTabsModule, MatProgressBarModule, MatSelectModule, MatFormFieldModule,
    MatDatepickerModule, MatInputModule, MatButtonModule, MatButtonToggleModule
  ]
})
export class ProfileModule { }
