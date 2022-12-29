import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { TeamsService } from 'src/app/_services/teams.service';
import { environment } from 'src/environments/environment';
import { Task } from '../task-create/Task';
import { TaskCreateComponent } from '../task-create/task-create.component';
import { TaskFeature } from '../task-feature-create/TaskFeature';
import { TaskViewComponent } from '../task-view/task-view.component';
import { TeamMembers } from '../team-members/TeamMembers';
import { TeamSetting } from '../team-settings/TeamSetting';
import { Teams } from '../teams/Teams';

@Component({
  selector: 'app-team-dashboard',
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.css']
})
export class TeamDashboardComponent implements OnInit {

  constructor(private ts: TeamsService, private actRoute: ActivatedRoute,
    private router: Router, private dialog: MatDialog) {

    this.actRoute.queryParams.subscribe(params => {
      console.log(params);
    });

  }

  @Input() team: Teams;
  @Input() set myTeamMembershipEmitter(myTeamMembership: TeamMembers) {
    console.log("teamMember Input Received::", myTeamMembership);
    this.member = myTeamMembership;
    this.handleCreateAccess();
    if (this.member !== undefined)
      this.loadTeamTasks();
  };
  @Input() set selectedMemberEmitter(selectedMember: TeamMembers) {
    console.log("selectedMember Input Received::", selectedMember);
    this._selected_member = selectedMember;
    this.handleCreateAccess();
  };
  @Input() set teamSetting(teamSetting: TeamSetting) {
    console.log("teamSetting Input Received::", teamSetting);
    this.setting = teamSetting;
    this.handleCreateAccess();
  };
  @Input() set allTeamMembersEmitter(allTeamMembers: Array<TeamMembers>) {
    console.log("allTeamMembersEmitter Input Received::", allTeamMembers);
    this.allTeamMembers = allTeamMembers;
  };
  @Input() set allAgents(allAgents: Array<Agent>) {
    console.log("allAgents Input Received::", allAgents);
    this.agents = allAgents;
  };
  @Input() set allFeaturesEmitter(features: Array<TaskFeature>) {
    console.log("features Input Received::", features);
    this.allFeatures = features;
  };

  @Output() triggerFeatureReload: EventEmitter<Task> = new EventEmitter();

  handleCreateAccess() {
    if (this.team.leadEmail == this.ts.auth.getLoginEmailId()) {
      this.canCreateTasks = true;
    } else if (this.member !== undefined && this.member.memberRole == 'Administrator') {
      this.canCreateTasks = true;
    } else if (this.member !== undefined && this.member.memberRole == 'Member'
      && this.setting !== undefined && this.setting.membersCanCreateTasks) {
      this.canCreateTasks = true;
    } else {
      this.canCreateTasks = false;
    }
  }


  loading = false;
  canCreateTasks = false;
  workflows = [];

  search = {
    taskName: '',
    featureName: '',
    taskPriority: '',
    reporter: '',
    assignee: ''
  }

  tasks: Array<Task> = [];
  tasks_show: Array<Task> = [];
  member: TeamMembers;
  _selected_member: TeamMembers;
  allTeamMembers: Array<TeamMembers>;
  setting: TeamSetting;
  agents: Array<Agent>;
  allFeatures: Array<TaskFeature>;

  ngOnInit() {
    if (this.team.workflows != null && this.team.workflows != '') {
      console.log(this.team.workflows);
      let _workflows = Array.from(this.team.workflows.split(';'));

      _workflows.filter(status => status.length > 0).forEach(status => {
        this.workflows.push(status);
      })
    }

    this.actRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['action'] && params['action'] == 'view-task') {
        console.log(params);
        if (params['action-id']) {
          console.log(params);
          let task = new Task();
          task.taskId = params['action-id'];
          this.openViewTaskDialog(task);
        }
      }
    });
  }

  loadTeamTasks() {
    this.loading = true;
    this.ts.loadTeamTasks(this.team, this.member).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.tasks = resp['Tasks'];
      }
    }, error => this.loading = false)
  }

  getTaskByStatus(status): Array<Task> {
    return this.tasks
      .filter(task => this._selected_member === undefined || this._selected_member.memberEmailId == task.assignee)
      .filter(task => task.status.toLowerCase() == status.toLowerCase())
      .filter(task => (this.search.taskName.length === 0) ? true : task.subject.toLowerCase().includes(this.search.taskName.toLowerCase()))
      .filter(task => (this.search.featureName.length === 0) ? true : this.getFeatureName(task.featureId).toLowerCase().includes(this.search.featureName.toLowerCase()))
      .filter(task => (this.search.taskPriority.length === 0) ? true : task.priority.toLowerCase() == (this.search.taskPriority.toLowerCase()))
      .filter(task => (this.search.assignee.length === 0) ? true : task.assignee.toLowerCase() == (this.search.assignee.toLowerCase()))
      .filter(task => (this.search.reporter.length === 0) ? true : task.reporter.toLowerCase() == (this.search.reporter.toLowerCase()))
  }

  openCreateTaskDialog() {
    const dialogRef = this.dialog.open(TaskCreateComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: { member: this.member, setting: this.setting, team: this.team, allTeamMembers: this.allTeamMembers, allFeatures: this.allFeatures }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined && result !== '') {
        this.tasks.push(result);
        this.openViewTaskDialog(result);
        this.triggerFeatureReload.next(result);
      }
    });
  }

  routeToViewTaskDialog(task: Task) {
    this.router.navigateByUrl('/teams/view/1/dashboard?action=view-task&action-id=' + task.taskId);
  }

  openViewTaskDialog(task: Task) {
    const dialogRef = this.dialog.open(TaskViewComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      autoFocus: false,
      disableClose: true,
      data: { task: task, member: this.member, setting: this.setting, team: this.team, allTeamMembers: this.allTeamMembers, allFeatures: this.allFeatures }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined && result['action'] == 'Task Deleted') {
        this.loadTeamTasks();
      } else if (result !== undefined && result['action'] == 'Task Updated') {
        if (result['task'] !== undefined) {
          let index = this.tasks.findIndex(_task => _task.taskId == result['task']['taskId']);
          this.tasks[index] = result['task'];
        }
      }
      this.triggerFeatureReload.next(task);
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

  getFeatureName(featureId) {
    if (this.allFeatures === undefined)
      return " - - ";
    let feature = this.allFeatures.find(feature => feature.featureId == featureId);
    if (feature === undefined)
      return "-";
    else
      return this.allFeatures.find(feature => feature.featureId == featureId).name;
  }

  getFeatureCaseBGColorByPriority(featureId) {
    if (this.allFeatures === undefined)
      return "text-light";
    let feature = this.allFeatures.find(feature => feature.featureId == featureId);
    if (feature === undefined)
      return "text-light";
    else if (feature.priority == 'Not Preferred')
      return "text-muted";
    else if (feature.priority == 'High')
      return "text-danger";
    else if (feature.priority == 'Medium')
      return "text-warning";
    else if (feature.priority == 'Low')
      return "text-info";
  }

  clearFilters() {
    this.search = {
      taskName: '',
      featureName: '',
      taskPriority: '',
      reporter: '',
      assignee: ''
    }
  }

}
