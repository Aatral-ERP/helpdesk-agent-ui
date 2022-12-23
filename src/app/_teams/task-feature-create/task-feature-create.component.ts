import { HttpEventType } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { NeededService } from 'src/app/_services/needed.service';
import { TeamsService } from 'src/app/_services/teams.service';
import { TeamMembers } from '../team-members/TeamMembers';
import { Teams } from '../teams/Teams';
import { TaskFeature } from './TaskFeature';

interface fileUpload {
  file: any;
  progress: number;
  status: string;
}

@Component({
  selector: 'app-task-feature-create',
  templateUrl: './task-feature-create.component.html',
  styleUrls: ['./task-feature-create.component.css']
})
export class TaskFeatureCreateComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private needed: NeededService,
    private snackbar: MatSnackBar, private ts: TeamsService, private dialogRef: MatDialogRef<TaskFeatureCreateComponent>) { }

  saving = false;
  loading = false;
  team: Teams = new Teams();
  feature: TaskFeature = new TaskFeature();
  teamMembers: Array<TeamMembers> = [];
  agents: Array<Agent> = [];
  files: Array<fileUpload> = [];
  directoryName = 'temp-files/' + this.ts.getRandomString(10);
  progress = 0;
  filesUploaded = 0;

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
    placeholder: 'Add Description about the feature',
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

    this.loadNeeded();
    console.log(this.data);
    if (this.data !== undefined) {
      this.team = this.data.team;
      this.feature = this.data.feature;
      this.teamMembers = this.data.teamMembers;
      // this.prepareCreateTaskAuthority();
    }
  }

  loadNeeded() {
    this.loading = true;
    this.needed.loadNeeded(['agents_min']).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.agents = resp['agents_min'];
      }
    }, error => this.loading = false);
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

            this.ts.uploadTaskFeatureAttachments(file, this.directoryName)
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

  createTaskFeature() {

    console.log(this.feature);
    let _error = false;
    if (this.feature.name === undefined || this.feature.name.length < 3) {
      this.errors.name = 'Subject sholud not be empty';
      _error = true;
    } else {
      this.errors.name = '';
    }
    if (this.feature.reporter === undefined || this.feature.reporter === null || this.feature.reporter == '') {
      this.errors.reporter = 'Select Reporter';
      _error = true;
    } else {
      this.errors.reporter = '';
    }
    let fileNames = '';
    if (this.files.length > 0) {
      this.files.forEach(file => {
        fileNames = fileNames + file.file.name + ';';
      });
      this.feature.files = fileNames;
    }

    if (_error) {
      this.snackbar.open('Please check the errors.');
      return;
    } else {
      this.feature.teamId = this.team.id;
      this.saving = true;
      this.ts.createTaskFeature(this.feature, this.directoryName).subscribe(resp => {
        this.saving = false;
        if (resp['StatusCode'] == "00") {
          this.feature = resp['TaskFeature'];
          this.dialogRef.close(this.feature);
        }
      }, error => this.saving = false)
    }
  }

  getMemberName(emailId) {
    let agent: Agent = this.agents.find(agent => agent.emailId == emailId);
    if (agent !== undefined)
      return agent.firstName + ' ' + agent.lastName;
    else
      return emailId;
  }

}
