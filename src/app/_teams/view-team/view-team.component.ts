import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { TeamsService } from 'src/app/_services/teams.service';
import { environment } from 'src/environments/environment';
import { TeamCreateComponent } from '../team-create/team-create.component';
import { TeamMembers } from '../team-members/TeamMembers';
import { TeamSetting } from '../team-settings/TeamSetting';
import { Teams } from '../teams/Teams';

@Component({
  selector: 'app-view-team',
  templateUrl: './view-team.component.html',
  styleUrls: ['./view-team.component.css']
})
export class ViewTeamComponent implements OnInit, OnDestroy {

  constructor(public ts: TeamsService, private actRoute: ActivatedRoute,
    private router: Router, private snackbar: MatSnackBar, private titleService: Title,
    public dialog: MatDialog) { }

  tab = 'dashbaord';
  agentName = '';
  role = 'Administrator'

  loading = false;
  team: Teams = new Teams();
  teamSetting: TeamSetting = new TeamSetting();
  allTeamMembers: Array<TeamMembers>
  myTeamMembership: TeamMembers;
  selectedMember: TeamMembers;

  agents: Array<Agent> = [];

  ngOnDestroy(): void {
    console.log('onDestroy')
    this.titleService.setTitle(environment.title);
  }

  ngOnInit() {
    this.actRoute.params.subscribe(params => {
      console.log(params);
      this.tab = params['tab'];
      if (params['id'] != this.team.id) {
        this.getTeam(params['id']);
      }
    })
  }

  getTeam(id) {
    this.loading = true;
    this.ts.getTeam(id).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {

        if (resp['Team'] && resp['Team'] != null) {
          this.team = resp['Team'];
          this.titleService.setTitle(this.team.name);
          this.loadTeamSetting();
          if (this.team.leadEmail != this.ts.auth.getLoginEmailId()) {
            this.router.navigateByUrl(`/teams/view/${this.team.id}/dashboard`);
            this.router.navigate([`/teams/view/${this.team.id}/dashboard`], {
              queryParams: this.actRoute.snapshot.queryParams
            });
          }
        } else {
          this.snackbar.open('No Team Found');
          this.router.navigateByUrl(`/teams/boards`);
        }
      }
    }, error => this.loading = false)
  }


  loadTeamSetting() {
    this.loading = true;
    this.ts.loadTeamSetting(this.team.id).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.teamSetting = resp['TeamSetting'];
      }
    }, error => this.loading = false)
  }

  openTeamCreateModal() {
    console.log();
    const dialogRef = this.dialog.open(TeamCreateComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: { team: this.team }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.getTeam(this.team.id);
    });
  }

}
