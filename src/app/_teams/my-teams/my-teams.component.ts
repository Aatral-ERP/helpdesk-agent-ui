import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';
import { TeamsService } from 'src/app/_services/teams.service';
import { TeamCreateComponent } from '../team-create/team-create.component';
import { Teams } from '../teams/Teams';


@Component({
  selector: 'app-my-teams',
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.css']
})
export class MyTeamsComponent implements OnInit {

  constructor(private ts: TeamsService, private router: Router, public dialog: MatDialog) { }

  role: RoleMaster = this.ts.auth.getLoggedInRole();

  teams: Array<Teams> = [];
  loading = false;
  ngOnInit() {
    this.getAllMyTeams();
  }

  styleObject(team: Teams) {
    return { 'border': '0.5px solid ' + team.colorcode, 'border-left': '10px solid ' + team.colorcode }
  }

  getAllMyTeams() {
    this.loading = true;
    this.ts.getAllMyTeams().subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.teams = resp['Teams'];
      }
    }, error => this.loading = false)
  }

  routeMeToTeamDashboard(team: Teams) {
    this.router.navigateByUrl('/teams/view/' + team.id);
  }

  openTeamCreateModal() {
    console.log();
    const dialogRef = this.dialog.open(TeamCreateComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getAllMyTeams();
    });
  }



}
