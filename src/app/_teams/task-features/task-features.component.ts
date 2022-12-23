import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { TeamsService } from 'src/app/_services/teams.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { TaskFeatureCreateComponent } from '../task-feature-create/task-feature-create.component';
import { TaskFeature } from '../task-feature-create/TaskFeature';
import { TeamMembers } from '../team-members/TeamMembers';
import { Teams } from '../teams/Teams';

@Component({
  selector: 'app-task-features',
  templateUrl: './task-features.component.html',
  styleUrls: ['./task-features.component.css']
})
export class TaskFeaturesComponent implements OnInit {

  constructor(private dialog: MatDialog, private ts: TeamsService, private snackbar: MatSnackBar) { }

  @Input() team: Teams = new Teams();
  @Input() teamMembers: Array<TeamMembers> = [];
  @Input() allAgents: Array<Agent> = [];
  @Output() featuresEmitter: EventEmitter<Array<TaskFeature>> = new EventEmitter();

  loading = false;
  features: Array<TaskFeature> = [];
  _search_feature_name: string = '';

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '400',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Add Description about the task',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    customClasses: [],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      [],
      ['insertImage', 'insertVideo', 'insertHorizontalRule', 'backgroundColor', 'textColor',
        'customClasses', 'link', 'unlink',]
    ]
  };

  errors = {
    name: '',
    assignee: '',
    reporter: '',
    dueDate: '',
    institute: ''
  }

  ngOnInit() {
    this.loadTaskFeatures();
  }

  loadTaskFeatures() {
    this.ts.loadTeamTaskFeatures(this.team.id).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.features = resp['TaskFeatures'];
        this.featuresEmitter.next(this.features);
      }
    })
  }

  openCreateTaskFeatureDialog(feature?: TaskFeature) {
    console.log();
    const dialogRef = this.dialog.open(TaskFeatureCreateComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      data: { team: this.team, feature: feature ? Object.assign({}, feature) : new TaskFeature(), teamMembers: this.teamMembers }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined && result !== '') {
        this.loadTaskFeatures();
      }
    });
  }

  deleteFeature(feature: TaskFeature) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete the Feature: ${feature.name}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change!'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.ts.deleteTaskFeature(feature).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Deleted Successfully: ' + feature.name);
            this.loadTaskFeatures();
          } else {
            this.snackbar.open('Failed to Delete : ' + resp['StatusDesc']);
          }
        }, error => {
          this.loading = false;
          this.snackbar.open('Failed to Delete : ' + error.error.message);
        })
      }
    })
  }

  getProgressBarPercentage(value: string, index: number) {
    return Math.round((Number(value.split('-')[index]) / this.getTotalTasksMapped(value)) * 100);
  }

  getProgressBarValue(value: string, index: number) {
    return Number(value.split('-')[index]);
  }

  getTotalTasksMapped(value: string) {
    return Array.from(value.split('-')).map(_val => Number(_val)).reduce((a, b) => a + b, 0);
  }

  getHTMLToolTipOfProgress(value: string) {
    return `To Do: ${value.split('-')[0]} \nIn Progress: ${value.split('-')[1]} \nDone:  ${value.split('-')[2]}`
  }

  getMemberName(emailId) {
    let agent: Agent = this.allAgents.find(agent => agent.emailId == emailId);
    if (agent !== undefined)
      return agent.firstName + ' ' + agent.lastName;
    else
      return emailId;
  }

  getMemberImageURL(emailId) {
    let agent: Agent = this.allAgents.find(agent => agent.emailId == emailId);
    if (agent !== undefined && agent.photoFileName !== undefined && agent.photoFileName != null && agent.photoFileName != '') {
      return environment.apiUrl + '/download/profile-photos/' + agent.photoFileName;
    } else {
      return 'https://buckinghamflooring.co.uk/wp-content/uploads/2019/10/user_5-15-512.png';
    }
  }

}
