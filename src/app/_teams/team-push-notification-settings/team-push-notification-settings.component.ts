import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TeamsService } from 'src/app/_services/teams.service';
import { Teams } from '../teams/Teams';
import { TeamPushNotifySetting } from './TeamPushNotifySetting';

@Component({
  selector: 'app-team-push-notification-settings',
  templateUrl: './team-push-notification-settings.component.html',
  styleUrls: ['./team-push-notification-settings.component.css']
})
export class TeamPushNotificationSettingsComponent implements OnInit {

  constructor(private ts: TeamsService, private snackbar: MatSnackBar) { }

  @Input() team: Teams;

  loading = false;

  teamPushNotifySettings: Array<TeamPushNotifySetting> = [];

  ngOnInit() {
    this.loadTeamPushNotifySetting();
  }

  loadTeamPushNotifySetting() {
    this.loading = true;
    this.ts.loadTeamPushNotifySetting(this.team.id).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.teamPushNotifySettings = resp['TeamPushNotifySettings'];
      }
    }, error => this.loading = false)
  }

  saveTeamPushNotifySetting() {
    this.loading = true;
    this.ts.saveTeamPushNotifySetting(this.team, this.teamPushNotifySettings).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Updated Successfully');
        this.teamPushNotifySettings = resp['TeamPushNotifySettings'];
      }
    }, error => this.loading = false)
  }


}
