import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamCreateComponent } from '../../_teams/team-create/team-create.component';
import { BoardsComponent } from '../../_teams/boards/boards.component';
import { TeamsComponent } from '../../_teams/teams/teams.component';
import { MatAutocompleteModule, MatButtonModule, MatButtonToggleModule, MatCheckboxModule, MatChipsModule, MatDatepickerModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule, MatNativeDateModule, MatOptionModule, MatProgressBarModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { ColorCompactModule } from 'ngx-color/compact';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewTeamComponent } from '../../_teams/view-team/view-team.component';
import { TeamSettingsComponent } from '../../_teams/team-settings/team-settings.component';
import { MyTeamsComponent } from '../../_teams/my-teams/my-teams.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TeamMembersComponent } from '../../_teams/team-members/team-members.component';
import { WorkflowComponent } from '../../_teams/workflow/workflow.component';
import { TeamDashboardComponent } from 'src/app/_teams/team-dashboard/team-dashboard.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TeamPushNotificationSettingsComponent } from '../../_teams/team-push-notification-settings/team-push-notification-settings.component';
import { TeamEmailNotificationSettingsComponent } from '../../_teams/team-email-notification-settings/team-email-notification-settings.component';
import { TaskCreateComponent } from '../../_teams/task-create/task-create.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { NgxFileDropModule } from 'ngx-file-drop';
import { NgxFilesizeModule } from 'ngx-filesize';
import { TaskViewComponent } from '../../_teams/task-view/task-view.component';
import { TaskHistoryComponent } from '../../_teams/task-history/task-history.component';
import { MomentModule } from 'ngx-moment';
import { TaskCommentsComponent } from '../../_teams/task-comments/task-comments.component';
import { SearchTasksComponent } from '../../_teams/search-tasks/search-tasks.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridButtonRendererModule } from '../common/ag-grid-button-renderer.module';
import { AGGridButtonRendererComponent } from '../common/ag-grid-button-renderer.component';
import { CalendarComponent } from '../../_teams/calendar/calendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin


FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [TeamCreateComponent, BoardsComponent, TeamsComponent, MyTeamsComponent,
    ViewTeamComponent, TeamDashboardComponent, TeamSettingsComponent, TeamMembersComponent,
    WorkflowComponent, TeamPushNotificationSettingsComponent, TeamEmailNotificationSettingsComponent,
    TaskCreateComponent, TaskViewComponent, TaskHistoryComponent, TaskCommentsComponent,
    SearchTasksComponent, CalendarComponent],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    MatSnackBarModule, MatFormFieldModule, MatMenuModule, MatProgressBarModule,
    MatInputModule, MatDialogModule, MatCheckboxModule, MatButtonToggleModule, MatChipsModule,
    MatOptionModule, MatIconModule, MatSelectModule, MatAutocompleteModule, NgxMatDatetimePickerModule,
    NgxMatTimepickerModule, NgxMatNativeDateModule, MatDatepickerModule, MatNativeDateModule,
    MatMomentDateModule, MatChipsModule, NgxFilesizeModule, MatButtonModule,
    DragDropModule,
    AngularEditorModule,
    FormsModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    NgMultiSelectDropDownModule,
    ColorCompactModule,
    MomentModule,
    AgGridModule.withComponents([AGGridButtonRendererComponent]),
    AgGridButtonRendererModule,
    FullCalendarModule
  ],
  entryComponents: [TeamCreateComponent, TaskViewComponent, TaskCreateComponent]
})
export class TeamsModule { }
