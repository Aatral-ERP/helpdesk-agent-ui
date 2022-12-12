import { HttpEventType } from '@angular/common/http';
import { TeamsService } from 'src/app/_services/teams.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { TaskViewComponent } from 'src/app/_teams/task-view/task-view.component';
import { LeadMailTemplate } from './LeadMailTemplate';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { environment } from 'src/environments/environment';

interface fileUpload {
  file: any;
  progress: number;
  status: string;
}

@Component({
  selector: 'app-lead-mail-template-create',
  templateUrl: './lead-mail-template-create.component.html',
  styleUrls: ['./lead-mail-template-create.component.css']
})
export class LeadMailTemplateCreateComponent implements OnInit {

  constructor(public dialog: MatDialog, private lms: LeadManagementService,
    private snackbar: MatSnackBar, private ts: TeamsService,
    public dialogRef: MatDialogRef<TaskViewComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  directoryName = 'temp-files/' + this.ts.getRandomString(10);
  _productSTR: string = '';
  filesUploaded = 0;
  files: Array<fileUpload> = [];

  template: LeadMailTemplate = new LeadMailTemplate();

  _lead_categorys: Array<string> = [];
  _industry_types: Array<string> = [];
  _lead_states: Array<string> = [];

  saving = false;
  deleting = false;
  _mode: string = 'Create'
  _errors = {
    title: '',
    subject: '',
    message: '',
    sendingAt: '',
    states: '',
    status: '',
    industryTypes: '',
    categories: ''
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '500',
    height: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Add Mail Message',
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

  ngOnInit() {

    console.log(this.data);
    if (this.data !== undefined) {
      this._mode = this.data.mode;
      if (this.data.template !== undefined && this.data.mode == 'Edit') {
        this.template = this.data.template;
        this.template._states = this.template.state.split(",").map(String);
        this.template._status = this.template.status.split(",").map(String);
        this.template._categories = this.template.category.split(",").map(String);
        this.template._industryTypes = this.template.industryType.split(",").map(String);
        console.log(this.template);
        this.directoryName = 'temp-files/' + this.template.id;
      } else if (this.data.template !== undefined && this.data.mode == 'Copy') {
        this.template = this.data.template;
        console.log(this.template);
        this.template._states = this.template.state.split(",").map(String);
        this.template._status = this.template.status.split(",").map(String);
        this.template._categories = this.template.category.split(",").map(String);
        this.template._industryTypes = this.template.industryType.split(",").map(String);
        this.directoryName = this.template.id + '';
        this.template.id = 0;
        console.log(this.template);
      }
      this._lead_categorys = this.data.lead_categorys;
      this._industry_types = this.data.industry_types;
      this._lead_states = this.data.lead_states;
    }
  }

  saveMailTemplate() {
    console.log(this.template);
    if (this.template.title == '')
      this._errors.title = `Title Can't be empty`;
    else
      this._errors.title = '';
    if (this.template.subject == '')
      this._errors.subject = `Subject Can't be empty`;
    else
      this._errors.subject = '';
    if (this.template.message == '')
      this._errors.message = `Message Can't be empty`;
    else
      this._errors.message = '';
    if (this.template.status == '')
      this._errors.status = `Status Can't be empty`;
    else
      this._errors.status = '';

    if (this.template._states.length == 0)
      this._errors.states = `Please select States`;
    else
      this._errors.states = '';

    if (this.template._status.length == 0)
      this._errors.states = `Please select Status`;
    else
      this._errors.states = '';

    if (this.template._industryTypes.length == 0)
      this._errors.states = `Please select Industry Types`;
    else
      this._errors.states = '';

    if (this.template._categories.length == 0)
      this._errors.states = `Please select Categories`;
    else
      this._errors.states = '';

    if (this._errors.states != '' || this._errors.industryTypes != '' || this._errors.categories != '' || this._errors.title != '' || this._errors.subject != '' || this._errors.message != '' || this._errors.status != '' || this._errors.sendingAt != '') {
      this.snackbar.open('Please check errors');
      return false;
    }

    this.template.state = this.template._states.join(",");
    this.template.status = this.template._status.join(",");
    this.template.industryType = this.template._industryTypes.join(",");
    this.template.category = this.template._categories.join(",");

    let fileNames = '';
    if (this.files.length > 0) {
      fileNames = this.files.map(file => file.file.name).join(';');

      if (this.template.files != '')
        this.template.files = this.template.files + ';' + fileNames;
      else
        this.template.files = fileNames;
    }

    this.saving = true;
    this.lms.saveMailTemplate(this.template, this.directoryName).subscribe(resp => {
      this.saving = false;
      if (resp['StatusCode'] == '00') {
        this.template = resp['LeadMailTemplate'];
        this.snackbar.open('Saved Successfully');
        this.dialogRef.close({ action: 'LeadMailTemplate Updated', LeadMailTemplate: this.template });
      }
    }, error => this.saving = false)
  }

  getAttachmentssAsArray(): Array<string> {
    if (this.template.files !== undefined && this.template.files != null && this.template.files != '')
      return this.template.files.split(';');
    else
      return [];
  }

  deleteFile(attach) {
    this.template.files = this.template.files.split(';').filter(file => file !== attach).join(';')
  }

  downloadLeadMailTemplateAttachmnet(attachment) {
    console.log(attachment);
    window.open(environment.contentPath + 'lead-mail-templateattachments/download/' + this.template.id + '/' + attachment, '_blank');
  }

  deleteMailTemplate() {
    this.deleting = true;
    this.lms.deleteMailTemplate(this.template).subscribe(resp => {
      this.deleting = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Deleted Successfully');
        this.dialogRef.close({ action: 'LeadMailTemplate Deleted', LeadMailTemplate: this.template });
      }
    }, error => this.deleting = false)
  }


  public filesDrop: NgxFileDropEntry[] = [];

  public dropped(files: NgxFileDropEntry[]) {
    console.log(files);

    this.filesDrop = files;
    for (const droppedFile of this.filesDrop) {

      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {

          if (file.size > 26214400) {
            this.snackbar.open(`File is exceeds limit 25MB`);
          } else {

            console.log(droppedFile.relativePath, file);

            let _file_upload: fileUpload = {
              file: file,
              progress: 0,
              status: 'uploading'
            }

            this.files.push(_file_upload);

            this.lms.uploadLeadMailTemplateAttachment(file, this.directoryName)
              .subscribe(resp => {
                if (resp.type == HttpEventType.UploadProgress) {
                  _file_upload.progress = Math.round(100 * resp.loaded / resp.total);
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

}
