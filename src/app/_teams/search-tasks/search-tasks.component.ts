import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AGGridButtonRendererComponent } from 'src/app/_modules/common/ag-grid-button-renderer.component';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { NeededService } from 'src/app/_services/needed.service';
import { TeamsService } from 'src/app/_services/teams.service';
import { Task } from '../task-create/Task';
import { TaskViewComponent } from '../task-view/task-view.component';
import { TeamMembers } from '../team-members/TeamMembers';
import { TeamSetting } from '../team-settings/TeamSetting';
import { Teams } from '../teams/Teams';

@Component({
  selector: 'app-search-tasks',
  templateUrl: './search-tasks.component.html',
  styleUrls: ['./search-tasks.component.css']
})
export class SearchTasksComponent implements OnInit {

  constructor(private ts: TeamsService, private needed: NeededService, private datePipe: DatePipe,
    public dialog: MatDialog, private snackbar: MatSnackBar) {
    this.frameworkComponents = {
      buttonRenderer: AGGridButtonRendererComponent,
    }
  }

  @Input() team: Teams = new Teams();

  @Input() set myTeamMembershipEmitter(myTeamMembership: TeamMembers) {
    console.log("teamMember Input Received::", myTeamMembership);
    this.member = myTeamMembership;
    if (this.member.memberRole == 'Member')
      this._filter.assignee = [this.ts.auth.getLoginEmailId()];
    //this.handleCreateAccess();
  };
  @Input() set teamSetting(teamSetting: TeamSetting) {
    console.log("teamSetting Input Received::", teamSetting);
    this.setting = teamSetting;
    //this.handleCreateAccess();
  };
  @Input() set allTeamMembersEmitter(allTeamMembers: Array<TeamMembers>) {
    console.log("teamSetting Input Received::", allTeamMembers);
    this.allTeamMembers = allTeamMembers;
  };
  @Input() set allAgents(allAgents: Array<Agent>) {
    console.log("teamSetting Input Received::", allAgents);
    this.agents = allAgents;
  };

  tasks: Array<Task> = [];
  member: TeamMembers;
  allTeamMembers: Array<TeamMembers>;
  setting: TeamSetting;
  agents: Array<Agent>;

  _workflows = [];
  _labels = [];
  _watchers = [];
  _instituteIds = [];

  _institutes = [];

  workflows_selected: any;
  loading = false;
  frameworkComponents: any;
  columnDefs = [
    {
      headerName: '', field: 'taskId', width: 40,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openViewTaskDialog2.bind(this),
        label: null
      }
    },
    {
      headerName: 'Id#', field: 'taskId', sortable: true, width: 100, filter: true, resizable: true, cellRenderer: (data) => {
        console.log(data);
        return `<a href="/teams/view/1/dashboard?action=view-task&action-id=${data.value}" target='_blank'>` + data.value + `</a>`;
      }
    },
    { headerName: 'Subject', field: 'subject', width: 100, sortable: true, filter: true, resizable: true },
    {
      headerName: 'Institute', field: 'instituteName', sortable: true, filter: true, resizable: true,
      tooltip: (data) => { return data.value }, cellRenderer: (data) => {
        return `<a href="/institute/institute-detail?iid=${data.data.instituteId}" target="_blank"> ${this.getInstituteName(data.value)} </a>`;
      }
    },
    { headerName: 'Label/Category', field: 'label', width: 100, sortable: true, filter: true, resizable: true },
    { headerName: 'Status', field: 'status', width: 100, sortable: true, filter: true, resizable: true },
    { headerName: 'Assignee', field: 'assignee', sortable: true, filter: true, resizable: true },
    { headerName: 'Reporter', field: 'createddatetime', width: 160, sortable: true, filter: true, resizable: true },
    { headerName: 'Reporter', field: 'dueDateTime', width: 160, sortable: true, filter: true, resizable: true },
    { headerName: 'Priority', field: 'priority', width: 160, sortable: true, filter: true, resizable: true },
    { headerName: 'Created By', field: 'createdBy', sortable: true, filter: true, resizable: true },
    { headerName: 'last Updated By', field: 'lastUpdatedBy', sortable: true, filter: true, resizable: true },
    { headerName: 'Created Date Time', field: 'createddatetime', width: 160, sortable: true, filter: true, resizable: true },
    { headerName: 'Last Updated Date Time', field: 'lastupdatedatetime', width: 160, sortable: true, filter: true, resizable: true },
  ];

  _filter = {
    taskId: '',
    teamId: this.team.id,
    instituteId: 0,
    instituteName: '',
    subject: '',
    status: [],
    assignee: [],
    reporter: [],
    priority: [],
    dueDateTimeFrom: null,
    dueDateTimeTo: null,
    labels: [],
    watchers: [],
    createdBy: [],
    lastUpdatedBy: [],
    createddatetimeFrom: null,
    createddatetimeTo: null,
    lastupdatedatetimeFrom: null,
    lastupdatedatetimeTo: null
  }

  ngOnInit() {
    this.loadTaskNeeded();
    this.loadNeeded();
    this.prepare_workflows();
  }

  loadNeeded() {
    this.needed.loadNeeded(['institutes_min']).subscribe(resp => {
      if (resp['StatusCode'] == "00") {
        this._institutes = resp['institutes_min'];
      }
    })
  }

  loadTaskNeeded() {
    this.ts.loadTaskNeeded({ teamId: this.team.id }).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this._labels = resp['labels'];
        this._instituteIds = resp['instituteIds'];
        this._watchers = resp['watchers'];
      }
    })
  }

  prepare_workflows() {
    this._workflows = [];

    if (this.team.workflows != null && this.team.workflows != '') {
      console.log(this.team.workflows);
      let workflows = Array.from(this.team.workflows.split(';'));

      workflows.filter(status => status.length > 0).forEach(status => {
        this._workflows.push(status);
      })
    }
  }

  onWorkflowsChanges() {
    console.log(this._filter.reporter);
  }

  getMemberName(emailId) {
    let agent: Agent = this.agents.find(agent => agent.emailId == emailId);
    if (agent !== undefined)
      return agent.firstName + ' ' + agent.lastName + " <" + agent.emailId + ">";
    else
      return emailId;
  }

  ChangeFilter(filter: string) {
    if (filter == 'My Open Issues') {
      let _workflow: Array<string> = [];

      this._workflows.filter(wf => wf != 'Done').forEach(wf => _workflow.push(wf));

      this._filter = {
        taskId: '',
        teamId: this.team.id,
        instituteId: 0,
        instituteName: '',
        subject: '',
        status: _workflow,
        assignee: [this.ts.auth.getLoginEmailId()],
        reporter: [],
        priority: [],
        dueDateTimeFrom: null,
        dueDateTimeTo: null,
        labels: [],
        watchers: [],
        createdBy: [],
        lastUpdatedBy: [],
        createddatetimeFrom: null,
        createddatetimeTo: null,
        lastupdatedatetimeFrom: null,
        lastupdatedatetimeTo: null
      }
    } else if (filter == 'My Closed Issues') {

      this._filter = {
        taskId: '',
        teamId: this.team.id,
        instituteId: 0,
        instituteName: '',
        subject: '',
        status: ['Done'],
        assignee: [this.ts.auth.getLoginEmailId()],
        reporter: [],
        priority: [],
        dueDateTimeFrom: null,
        dueDateTimeTo: null,
        labels: [],
        watchers: [],
        createdBy: [],
        lastUpdatedBy: [],
        createddatetimeFrom: null,
        createddatetimeTo: null,
        lastupdatedatetimeFrom: null,
        lastupdatedatetimeTo: null
      }
    } else if (filter == 'All My Issues') {
      this._filter = {
        taskId: '',
        teamId: this.team.id,
        instituteId: 0,
        instituteName: '',
        subject: '',
        status: [],
        assignee: [this.ts.auth.getLoginEmailId()],
        reporter: [],
        priority: [],
        dueDateTimeFrom: null,
        dueDateTimeTo: null,
        labels: [],
        watchers: [],
        createdBy: [],
        lastUpdatedBy: [],
        createddatetimeFrom: null,
        createddatetimeTo: null,
        lastupdatedatetimeFrom: null,
        lastupdatedatetimeTo: null
      }
    } else if (filter == 'Reporting to Me') {

      let _workflow: Array<string> = [];

      this._workflows.filter(wf => wf != 'Done').forEach(wf => _workflow.push(wf));

      this._filter = {
        taskId: '',
        teamId: this.team.id,
        instituteId: 0,
        instituteName: '',
        subject: '',
        status: _workflow,
        assignee: [],
        reporter: [this.ts.auth.getLoginEmailId()],
        priority: [],
        dueDateTimeFrom: null,
        dueDateTimeTo: null,
        labels: [],
        watchers: [],
        createdBy: [],
        lastUpdatedBy: [],
        createddatetimeFrom: null,
        createddatetimeTo: null,
        lastupdatedatetimeFrom: null,
        lastupdatedatetimeTo: null
      }
    } else if (filter == 'All Open Issues') {

      let _workflow: Array<string> = [];

      this._workflows.filter(wf => wf != 'Done').forEach(wf => _workflow.push(wf));

      this._filter = {
        taskId: '',
        teamId: this.team.id,
        instituteId: 0,
        instituteName: '',
        subject: '',
        status: _workflow,
        assignee: [],
        reporter: [],
        priority: [],
        dueDateTimeFrom: null,
        dueDateTimeTo: null,
        labels: [],
        watchers: [],
        createdBy: [],
        lastUpdatedBy: [],
        createddatetimeFrom: null,
        createddatetimeTo: null,
        lastupdatedatetimeFrom: null,
        lastupdatedatetimeTo: null
      }
    } else if (filter == 'All Closed Issues') {
      this._filter = {
        taskId: '',
        teamId: this.team.id,
        instituteId: 0,
        instituteName: '',
        subject: '',
        status: ['Done'],
        assignee: [],
        reporter: [],
        priority: [],
        dueDateTimeFrom: null,
        dueDateTimeTo: null,
        labels: [],
        watchers: [],
        createdBy: [],
        lastUpdatedBy: [],
        createddatetimeFrom: null,
        createddatetimeTo: null,
        lastupdatedatetimeFrom: null,
        lastupdatedatetimeTo: null
      }
    }
  }

  clearFilter() {
    this._filter = {
      taskId: '',
      teamId: this.team.id,
      instituteId: 0,
      instituteName: '',
      subject: '',
      status: [],
      assignee: [],
      reporter: [],
      priority: [],
      dueDateTimeFrom: null,
      dueDateTimeTo: null,
      labels: [],
      watchers: [],
      createdBy: [],
      lastUpdatedBy: [],
      createddatetimeFrom: null,
      createddatetimeTo: null,
      lastupdatedatetimeFrom: null,
      lastupdatedatetimeTo: null
    };

    if (this.member.memberRole == 'Member')
      this._filter.assignee = [this.ts.auth.getLoginEmailId()];
  }

  searchTeamTasks() {
    this.loading = true;
    this.ts.searchTeamTasks(this._filter).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.tasks = resp['Tasks'];
        if (this.tasks.length == 0) {
          this.snackbar.open('No Tasks Found..')
        }
      }
    }, error => this.loading = false)
  }

  getInstituteName(instituteId) {
    let institute: Institute = this._institutes.find(inst => inst.instituteId == instituteId);
    if (institute !== undefined)
      return institute.instituteName;
    else
      return '';
  }

  openViewTaskDialog2(event) {
    this.openViewTaskDialog(event.rowData);
  }

  openViewTaskDialog(task: Task) {
    console.log(task);
    const dialogRef = this.dialog.open(TaskViewComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      autoFocus: false,
      data: { task: task, member: this.member, setting: this.setting, team: this.team, allTeamMembers: this.allTeamMembers }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

}
