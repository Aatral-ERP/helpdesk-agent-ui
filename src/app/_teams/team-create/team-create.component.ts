import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatSnackBarConfig, MAT_DIALOG_DATA } from '@angular/material';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { NeededService } from 'src/app/_services/needed.service';
import { TeamsService } from 'src/app/_services/teams.service';
import { Teams } from '../teams/Teams';

@Component({
  selector: 'app-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.css']
})
export class TeamCreateComponent implements OnInit {

  constructor(private ts: TeamsService, private snackbar: MatSnackBar, private needed: NeededService,
    public dialogRef: MatDialogRef<TeamCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  team: Teams = new Teams();
  agents: Array<Agent> = [];

  saving = false;

  ngOnInit() {
    console.log(this.data);
    if (this.data !== undefined && this.data.team) {
      this.team = this.data.team;
    }
    if (this.team.id > 0) {
      this.loadAgents();
    }
  }

  loadAgents() {
    this.needed.loadNeeded(['agents_min']).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.agents = resp['agents_min'];
      }
    })
  }

  onColorChangeComplete(event) {
    console.log(event)
  }

  saveTeam() {
    if (this.team.name === undefined || this.team.name == null || this.team.name.length == 0) {
      this.snackbar.open('Team Name is not Valid');
      return;
    } else if (this.team.category === undefined || this.team.category == null || this.team.category.length == 0) {
      this.snackbar.open('Category is not Valid');
    } else {
      this.saving = true;
      this.ts.saveTeam(this.team).subscribe(resp => {
        this.saving = false;
        if (resp['StatusCode'] == '00') {
          this.snackbar.open('Saved Successfully');
          this.onModalClose();
        } else if (resp['StatusCode'] == '03') {
          this.snackbar.open(resp['StatusDesc']);
        } else {
          this.snackbar.open('Something went wrong.');
        }
      }, error => this.saving = false)
    }
  }

  onModalClose() {
    this.dialogRef.close(this.team);
  }

}
