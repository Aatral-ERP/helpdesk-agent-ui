import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TeamsService } from 'src/app/_services/teams.service';
import { Teams } from '../teams/Teams';
import { TeamSetting } from './TeamSetting';

@Component({
  selector: 'app-team-settings',
  templateUrl: './team-settings.component.html',
  styleUrls: ['./team-settings.component.css']
})
export class TeamSettingsComponent implements OnInit {

  constructor(private ts: TeamsService, private snackbar: MatSnackBar) { }

  @Input() team: Teams;
  @Output() teamSettingEmitter: EventEmitter<TeamSetting> = new EventEmitter();
  @Input() set teamSetting(teamSetting: TeamSetting) {
    console.log(teamSetting);
    this.setting = Object.assign({}, teamSetting);
  }

  loading = false;

  setting: TeamSetting = new TeamSetting();

  ngOnInit() {
  }

  saveTeamSetting() {
    this.loading = true;
    this.ts.saveTeamSetting(this.team, this.setting).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Updated Successfully');
        this.setting = resp['TeamSetting'];
        this.teamSettingEmitter.next(this.setting);
      }
    }, error => this.loading = false)

  }

}
