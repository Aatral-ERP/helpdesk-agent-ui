import { HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { NeededService } from 'src/app/_services/needed.service';
import { TeamsService } from 'src/app/_services/teams.service';
import { TeamMembers } from '../team-members/TeamMembers';
import { TeamSetting } from '../team-settings/TeamSetting';
import { Teams } from '../teams/Teams';
import { Task } from './Task';

interface fileUpload {
  file: any;
  progress: number;
  status: string;
}

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {

  constructor(private ts: TeamsService, public dialogRef: MatDialogRef<TaskCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private needed: NeededService,
    private snackbar: MatSnackBar) { }

  canCreateTaskToAnyMembers = false;
  saving = false;
  loading = false;
  team: Teams;
  setting: TeamSetting;
  member: TeamMembers;
  allTeamMembers: Array<TeamMembers>;
  agents: Array<Agent> = [];
  institutes: Array<Institute> = [];

  progress = 0;

  task: Task = new Task();
  directoryName = 'temp-files/' + this.ts.getRandomString(10);
  files: Array<fileUpload> = [];
  filesUploaded = 0;
  labels: Array<string> = [];

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
    subject: '',
    assignee: '',
    reporter: '',
    dueDate: '',
    institute: ''
  }

  ngOnInit() {
    this.loadNeeded();
    console.log(this.data);
    if (this.data !== undefined) {
      this.team = this.data.team;
      this.member = this.data.member;
      this.setting = this.data.setting;
      this.allTeamMembers = this.data.allTeamMembers;

      this.task.teamId = this.team.id;
      this.task.createdBy = this.ts.auth.getLoginEmailId();
      this.task.assignee = this.ts.auth.getLoginEmailId();
      this.task.reporter = this.ts.auth.getLoginEmailId();

      this.prepareCreateTaskAuthority();
    }
  }

  prepareCreateTaskAuthority() {
    if (this.team.leadEmail == this.ts.auth.getLoginEmailId()) {
      this.canCreateTaskToAnyMembers = true;
    } else if (this.member.memberRole == 'Administrator' && this.setting.adminCanCreateTasks) {
      this.canCreateTaskToAnyMembers = true;
    }
  }

  loadNeeded() {
    this.loading = true;
    this.needed.loadNeeded(['agents_min', 'tasks_labels_distinct', 'institutes_min']).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.agents = resp['agents_min'];
        this.labels = resp['tasks_labels_distinct'];
        this.institutes = resp['institutes_min'];
      }
    }, error => this.loading = false);
  }

  optionSelected(event) {
    console.log(event);
  }

  getMemberName(emailId) {
    let agent: Agent = this.agents.find(agent => agent.emailId == emailId);
    if (agent !== undefined)
      return agent.firstName + ' ' + agent.lastName + ' <' + agent.emailId + '>';
    else
      return emailId;
  }

  public filesDrop: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    this.filesDrop = files;
    for (const droppedFile of this.filesDrop) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          if (file.size > 26214400) {
            this.snackbar.open(`File is exceeds limit 25MB`);
          } else {

            // Here you can access the real file
            console.log(droppedFile.relativePath, file);

            let _file_upload: fileUpload = {
              file: file,
              progress: 0,
              status: 'uploading'
            }

            this.files.push(_file_upload);

            this.ts.uploadTaskAttachments(file, this.directoryName)
              .subscribe(resp => {
                if (resp.type == HttpEventType.UploadProgress) {
                  _file_upload.progress = Math.round(100 * resp.loaded / resp.total);
                  console.log('Progress ' + this.progress + '%');
                }
                if (resp.type === HttpEventType.Response) {
                  console.log('Upload complete');
                  _file_upload.status = 'Uploaded';
                  this.filesUploaded = this.filesUploaded + 1;
                }
              });
          }
        });
      }
    }
  }

  createTask() {

    console.log(this.task);
    let _error = false;
    if (this.task.subject === undefined || this.task.subject.length < 3) {
      this.errors.subject = 'Subject sholud not be empty';
      _error = true;
    } else {
      this.errors.subject = '';
    }
    if (this.task.reporter === undefined || this.task.reporter === null || this.task.reporter == '') {
      this.errors.reporter = 'Select Reporter';
      _error = true;
    } else {
      this.errors.reporter = '';
    }
    if (this.task.instituteName !== undefined && this.task.instituteName != null && this.task.instituteName != '') {
      let _inst = this.institutes.find(inst => inst.instituteName == this.task.instituteName);
      if (_inst !== undefined) {
        this.task.instituteId = _inst.instituteId;
      } else {
        this.errors.institute = 'Invalid Institute';
        _error = true;
      }
    } else {
      this.errors.institute = '';
    }

    let fileNames = '';
    if (this.files.length > 0) {
      this.files.forEach(file => {
        fileNames = fileNames + file.file.name + ';';
      });
      this.task.files = fileNames;
    }

    if (_error) {
      this.snackbar.open('Please check the errors.');
      return;
    } else {
      console.log(this.task);
      this.saving = true;
      this.ts.createTask(this.task, this.directoryName).subscribe(resp => {
        this.saving = false;
        if (resp['StatusCode'] == "00") {
          this.task = resp['Task'];
          this.dialogRef.close(this.task);
        }
      }, error => this.saving = false)
    }


  }

}
