import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TeamsService } from 'src/app/_services/teams.service';
import { TeamSetting } from '../team-settings/TeamSetting';
import { Teams } from '../teams/Teams';
import { TeamEmailSetting } from './TeamEmailSetting';

@Component({
  selector: 'app-team-email-notification-settings',
  templateUrl: './team-email-notification-settings.component.html',
  styleUrls: ['./team-email-notification-settings.component.css']
})
export class TeamEmailNotificationSettingsComponent implements OnInit {

  constructor(private ts: TeamsService, private snackbar: MatSnackBar) { }

  @Input() team: Teams;

  loading = false;

  teamEmailSettings: Array<TeamEmailSetting> = [];

  ngOnInit() {
    this.loadTeamEmailSetting();
  }

  loadTeamEmailSetting() {
    this.loading = true;
    this.ts.loadTeamEmailSetting(this.team.id).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.teamEmailSettings = resp['TeamEmailSettings'];
      }
    }, error => this.loading = false)

  }

  saveTeamEmailSetting() {
    this.loading = true;
    this.ts.saveTeamEmailSetting(this.team, this.teamEmailSettings).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Updated Successfully');
        this.teamEmailSettings = resp['TeamEmailSettings'];
      }
    }, error => this.loading = false)

  }

}
