import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { AgentService } from 'src/app/_services/agent.service';
import { NeededService } from 'src/app/_services/needed.service';
import { TeamsService } from 'src/app/_services/teams.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Teams } from '../teams/Teams';
import { TeamMembers } from './TeamMembers';
declare var $: any;

@Component({
  selector: 'app-team-members',
  templateUrl: './team-members.component.html',
  styleUrls: ['./team-members.component.css']
})
export class TeamMembersComponent implements OnInit {

  constructor(private needed: NeededService, public ts: TeamsService, private router: Router,
    private as: AgentService, private snackbar: MatSnackBar) { }

  @Input() team: Teams;
  @Output() myTeamMembershipEmitter: EventEmitter<TeamMembers> = new EventEmitter();
  @Output() selectedMemberEmitter: EventEmitter<TeamMembers> = new EventEmitter();
  @Output() allTeamMembersEmitter: EventEmitter<Array<TeamMembers>> = new EventEmitter();
  @Output() allAgentsMinEmitter: EventEmitter<Array<Agent>> = new EventEmitter();

  members: Array<TeamMembers> = [];
  agents: Array<Agent> = [];
  _my_team_membership: TeamMembers;

  loading = false;
  viewAll = true;

  agentName = '';
  selectedMember = '';
  role = 'Administrator'
  add_agents_show: Array<Agent> = [];

  ngOnInit() {
    this.loadNeeded();
    this.loadTeamMember();

  }

  loadNeeded() {
    this.needed.loadNeeded(['agents_min']).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.agents = resp['agents_min'];
        this.allAgentsMinEmitter.next(this.agents);
      }
    });
  }

  selectMember(member: TeamMembers) {
    if (this._my_team_membership.memberRole != 'Member') {
      if (this.selectedMember == member.memberEmailId) {
        this.selectedMember = '';
        this.selectedMemberEmitter.next(undefined);
      } else {
        this.selectedMember = member.memberEmailId;
        this.selectedMemberEmitter.next(member);
      }
    }
  }

  loadTeamMember() {
    this.loading = true;
    this.ts.getTeamMembers(this.team.id).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.members = resp['TeamMembers'];

        this._my_team_membership = this.members.find(member => member.memberEmailId == this.ts.auth.getLoginEmailId());
        this.myTeamMembershipEmitter.next(this._my_team_membership);
        this.allTeamMembersEmitter.next(this.members);

        if (this._my_team_membership === undefined) {
          this.snackbar.open(`You are not a member of team '${this.team.name}' `);
          this.router.navigateByUrl('/teams/boards');
        } else if (this._my_team_membership.memberRole == 'Member') {
          this.selectedMember = this._my_team_membership.memberEmailId;
        }
      }
    }, error => this.loading = false);
  }

  addNewMember(agent) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to Add ${agent.firstName} ${agent.lastName} <${agent.emailId}>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Add!'
    }).then((result) => {
      if (result.value) {
        $(function () {
          $('#agentaddmodal').appendTo("body").modal('hide');
        });

        let member = new TeamMembers();
        member.teamId = this.team.id;
        member.memberEmailId = agent.emailId;
        member.memberRole = this.role;

        this.ts.addTeamMember(this.team, agent, member).subscribe(resp => {
          if (resp['StatusCode'] == '00') {
            this.members.push(resp['TeamMember']);
            this.snackbar.open('Added Successfully');
          } else if (resp['StatusCode'] == '03') {
            this.snackbar.open(resp['StatusDesc']);
          } else {
            this.snackbar.open('Something went wrong, Try later');
          }
        })
      }
    })
  }

  openAddCommentModal() {
    this.add_agents_show = this.agents
      .filter(agent => this.ts.auth.getLoginEmailId() != agent.emailId)
      .filter(agent => (this.members.find(mem => mem.memberEmailId == agent.emailId)) === undefined);

    $(function () {
      $('#agentaddmodal').appendTo("body").modal('show');
    });
  }

  getMemberImageURL(emailId) {
    let agent: Agent = this.agents.find(agent => agent.emailId == emailId);
    if (agent !== undefined && agent.photoFileName !== undefined && agent.photoFileName != null && agent.photoFileName != '') {
      return environment.apiUrl + '/download/profile-photos/' + agent.photoFileName;
    } else {
      return 'https://buckinghamflooring.co.uk/wp-content/uploads/2019/10/user_5-15-512.png';
    }
  }

  getMemberName(emailId) {
    let agent: Agent = this.agents.find(agent => agent.emailId == emailId);
    if (agent !== undefined)
      return agent.firstName + ' ' + agent.lastName;
    else
      return emailId;
  }

  changeRole(member: TeamMembers) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to Change the Role`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change!'
    }).then((result) => {
      if (result.value) {
        this.snackbar.open('Changing Role...');
        this.ts.addTeamMember(this.team, this.agents.find(agent => agent.emailId == member.memberEmailId), member).subscribe(resp => {
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Updated Successfully');
            this.loadTeamMember();
          } else if (resp['StatusCode'] == '03') {
            this.snackbar.open(resp['StatusDesc']);
          } else {
            this.snackbar.open('Something went wrong, Try later.');
          }
        })
      }
    })
  }

  makeTeamLead(member: TeamMembers) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to make ${this.getMemberName(member.memberEmailId)} as Team Lead.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.snackbar.open('Changing Team Lead...');

        let _team: Teams = Object.assign({}, this.team);
        _team.leadName = this.getMemberName(member.memberEmailId);
        _team.leadEmail = member.memberEmailId;

        this.ts.saveTeam(_team).subscribe(resp => {
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Updated Successfully');
            this.team = _team;
            window.location.reload();
          } else if (resp['StatusCode'] == '03') {
            this.snackbar.open(resp['StatusDesc']);
          } else {
            this.snackbar.open('Something went wrong, Try later.');
          }
        })
      }
    })
  }

  deleteMember(member: TeamMembers) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete ${this.getMemberName(member.memberEmailId)}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {
        this.snackbar.open('Deleting member...');
        this.ts.deleteTeamMember(this.team, member).subscribe(resp => {
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Deleted Successfully');
            this.loadTeamMember();
          } else if (resp['StatusCode'] == '03') {
            this.snackbar.open(resp['StatusDesc']);
          } else {
            this.snackbar.open('Something went wrong, Try later.');
          }
        })
      }
    })
  }

}
