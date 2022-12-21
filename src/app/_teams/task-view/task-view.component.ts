import { DatePipe } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { NeededService } from 'src/app/_services/needed.service';
import { TeamsService } from 'src/app/_services/teams.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Task } from '../task-create/Task';
import { TaskHistory } from '../task-history/TaskHistory';
import { TeamMembers } from '../team-members/TeamMembers';
import { TeamSetting } from '../team-settings/TeamSetting';
import { Teams } from '../teams/Teams';
declare var $: any;

interface fileUpload {
  file: any;
  progress: number;
  status: string;
}

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

  constructor(private ts: TeamsService, public dialogRef: MatDialogRef<TaskViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private needed: NeededService,
    private snackbar: MatSnackBar, private datePipe: DatePipe) { }

  task: Task;
  team: Teams;
  setting: TeamSetting;
  member: TeamMembers;
  allTeamMembers: Array<TeamMembers>;

  agents: Array<Agent> = [];
  institutes: Array<Institute> = [];
  workflows: Array<string> = [];

  watchers: Array<string> = [];
  addingWatchers = false;
  searchwatchersSTR = '';
  agents_show: Array<Agent> = [];

  attachments: Array<string> = [];

  shareWhatsappText = '';
  shareWhatsappTo = '';

  changeAssigneeSTR = '';
  changeReporterSTR = '';

  loading = false;
  saving = false;
  showAttachmentBtn = false;

  canManageAttachments = false;
  canChangeStatus = false;
  canCloseTask = false;
  canModifyTask = false;
  canCommentTask = false;

  showFooter = 'Comments';
  _dueDateTime = null;

  ngOnInit() {
    console.log(this.data);
    this.team = this.data.team;
    this.task = this.data.task;
    this.member = this.data.member;
    this.setting = this.data.setting;
    this.allTeamMembers = this.data.allTeamMembers;

    this.getTask(this.task.taskId);
    this.loadNeeded();
  }

  loadNeeded() {
    this.loading = true;
    this.needed.loadNeeded(['agents_min', 'institutes_min']).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.agents = resp['agents_min'];
        this.institutes = resp['institutes_min'];
      }
    }, error => this.loading = false);
  }

  getTask(taskId) {
    this.loading = true;
    this.ts.getTask(taskId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.task = resp['Task'];

        this.handleGetTask();

      }
    }, error => this.loading = false)
  }

  handleGetTask() {
    this.prepare_workflows();
    this.prepare_watchers();
    this.prepare_Attachments();
    this.prepare_canChangeStatus();
    this.prepare_canCloseTask();
    this.prepare_canModifyTask();
    this.prepare_canCommentTask();
    this.prepare_canManageAttachments();
  }

  prepare_canManageAttachments() {
    if (this.task.assignee == this.ts.auth.getLoginEmailId()) {
      this.canManageAttachments = true;
    } else if (this.task.reporter == this.ts.auth.getLoginEmailId()) {
      this.canManageAttachments = true;
    } else if (this.team.leadEmail == this.ts.auth.getLoginEmailId()) {
      this.canManageAttachments = true;
    } else if (this.setting.adminCanModifyOthersTasks && this.member.memberRole == 'Administrator') {
      this.canManageAttachments = true;
    } else {
      this.canManageAttachments = false;
    }
  }

  prepare_Attachments() {
    this.attachments = [];
    if (this.task.files != null && this.task.files != '') {
      console.log(this.task.files);
      let files = Array.from(this.task.files.split(';'));

      files.filter(file => file.length > 0).forEach(file => {
        this.attachments.push(file);
      })
    }
  }

  prepare_workflows() {
    this.workflows = [];

    if (this.team.workflows != null && this.team.workflows != '') {
      console.log(this.team.workflows);
      let workflows = Array.from(this.team.workflows.split(';'));

      workflows.forEach(status => {
        if (status != 'To Do' && status != 'Done' && status.length != 0) {
          this.workflows.push(status);
        }
      })
    }
  }

  prepare_watchers() {
    this.watchers = [];
    if (this.task.watchers != null && this.task.watchers != '') {
      console.log(this.task.watchers);
      let watchers = Array.from(this.task.watchers.split(';'));

      watchers.filter(watcher => watcher.length > 0).forEach(watcher => {
        this.watchers.push(watcher);
      })
    }
  }

  prepare_canChangeStatus() {
    if (this.task.assignee == this.ts.auth.getLoginEmailId()) {
      this.canChangeStatus = true;
    } else if (this.task.reporter == this.ts.auth.getLoginEmailId()) {
      this.canChangeStatus = true;
    } else if (this.team.leadEmail == this.ts.auth.getLoginEmailId()) {
      this.canChangeStatus = true;
    } else if (this.setting.adminCanModifyOthersTasks && this.member.memberRole == 'Administrator') {
      this.canChangeStatus = true;
    }
  }

  prepare_canCloseTask() {
    if (this.task.reporter == this.ts.auth.getLoginEmailId()) {
      this.canCloseTask = true;
    } else if (this.team.leadEmail == this.ts.auth.getLoginEmailId()) {
      this.canCloseTask = true;
    } else if (this.setting.adminCanModifyOthersTasks && this.member.memberRole == 'Administrator') {
      this.canCloseTask = true;
    } else if (this.setting.membersCanCloseTaskOfOwn && this.member.memberRole == 'member') {
      this.canCloseTask = true;
    } else {
      this.canCloseTask = false;
    }
  }

  prepare_canModifyTask() {
    if (this.task.reporter == this.ts.auth.getLoginEmailId()) {
      this.canModifyTask = true;
    } else if (this.team.leadEmail == this.ts.auth.getLoginEmailId()) {
      this.canModifyTask = true;
    } else if (this.setting.adminCanModifyOthersTasks && this.member.memberRole == 'Administrator') {
      this.canModifyTask = true;
    } else {
      this.canModifyTask = false;
    }
  }

  prepare_canCommentTask() {
    if (this.task.reporter == this.ts.auth.getLoginEmailId()) {
      this.canCommentTask = true;
    } else if (this.task.assignee == this.ts.auth.getLoginEmailId()) {
      this.canCommentTask = true;
    } else if (this.team.leadEmail == this.ts.auth.getLoginEmailId()) {
      this.canCommentTask = true;
    } else if (this.member.memberRole == 'Administrator') {
      this.canCommentTask = true;
    } else if (this.member.memberRole == 'Member' && this.setting.membersCanCommentOthersTasks) {
      this.canCommentTask = true;
    } else if (this.member.memberRole == 'Viewer' && this.setting.viewerCanCommentTasks) {
      this.canCommentTask = true;
    } else {
      this.canCommentTask = false;
    }
  }

  stopPropagation(event) {
    event.stopPropagation();
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

  getInstituteName(instId) {
    let inst: Institute = this.institutes.find(inst => inst.instituteId == instId);
    if (inst !== undefined)
      return inst.instituteName;
    else
      return "-";
  }

  openAddWatcherModal() {
    let _agents_show = [];
    this.agents
      .filter(agent => (this.watchers.find(watcher => watcher == agent.emailId) === undefined))
      .forEach(agent => {
        _agents_show.push(agent);
      })

    this.agents_show = _agents_show;

    $(function () {
      $('#watchersaddmodal').appendTo("body").modal('show');
    });
  }

  closeAddWatcherModal() {
    $(function () {
      $('#watchersaddmodal').appendTo("body").modal('hide');
    });
  }

  addWatcher(emailId) {

    Swal.fire({
      title: 'Are you sure?',
      text: `You want to add <${this.getMemberName(emailId)}>.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Add!'
    }).then((result) => {
      if (result.value) {

        let taskHistory: TaskHistory = new TaskHistory();

        taskHistory.taskId = this.task.taskId;
        taskHistory.field = 'Added Watcher';
        taskHistory.historyFrom = '';
        taskHistory.historyTo = emailId;
        taskHistory.updatedBy = this.ts.auth.getLoginEmailId();

        let _watchers = '';

        this.watchers.forEach(watcher => { _watchers = _watchers + watcher + ';' });
        _watchers = _watchers + emailId + ';'

        let _task = Object.assign({}, this.task);
        _task.watchers = _watchers;

        this.ts.updateTask(_task, taskHistory).subscribe(resp => {
          this.closeAddWatcherModal();
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Added watcher successfully');
            this.task = resp['Task'];
            this.handleGetTask();
          }
        }, error => this.closeAddWatcherModal())

      }
    })
  }

  removeWatcher(emailId) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to remove <${this.getMemberName(emailId)}>.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Remove!'
    }).then((result) => {
      if (result.value) {

        let taskHistory: TaskHistory = new TaskHistory();

        taskHistory.taskId = this.task.taskId;
        taskHistory.field = 'Removed Watcher';
        taskHistory.historyFrom = '';
        taskHistory.historyTo = emailId;
        taskHistory.updatedBy = this.ts.auth.getLoginEmailId();

        let _watchers = '';

        this.watchers
          .filter(watcher => watcher != emailId)
          .forEach(watcher => { _watchers = _watchers + watcher + ';' });

        let _task = Object.assign({}, this.task);
        _task.watchers = _watchers;

        this.ts.updateTask(_task, taskHistory).subscribe(resp => {
          this.closeAddWatcherModal();
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Removed watcher successfully');
            this.task = resp['Task'];
            this.handleGetTask();
          }
        }, error => this.closeAddWatcherModal())

      }
    })
  }

  ChangePriority(priority) {
    let taskHistory: TaskHistory = new TaskHistory();

    taskHistory.taskId = this.task.taskId;
    taskHistory.field = 'Changed Priority';
    taskHistory.historyFrom = this.task.priority;
    taskHistory.historyTo = priority;
    taskHistory.updatedBy = this.ts.auth.getLoginEmailId();

    let _task = Object.assign({}, this.task);
    _task.priority = priority;
    this.loading = true;
    this.ts.updateTask(_task, taskHistory).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Changed Status successfully');
        this.task = resp['Task'];
        this.handleGetTask();
      }
    }, error => this.loading = false)

  }

  ChangeStatus(status) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to change the Status.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change!'
    }).then((result) => {
      if (result.value) {

        let taskHistory: TaskHistory = new TaskHistory();

        taskHistory.taskId = this.task.taskId;
        taskHistory.field = 'Changed Status';
        taskHistory.historyFrom = this.task.status;
        taskHistory.historyTo = status;
        taskHistory.updatedBy = this.ts.auth.getLoginEmailId();

        let _task = Object.assign({}, this.task);
        _task.status = status;
        this.loading = true;
        this.ts.updateTask(_task, taskHistory).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Changed Status successfully');
            this.task = resp['Task'];
            this.handleGetTask();
          }
        }, error => this.loading = false)

      }
    })
  }

  deleteTask() {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to Delete this task, This can't be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {

        let _task = Object.assign({}, this.task);
        this.loading = true;
        this.ts.deleteTask(_task).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Deleted successfully');
            this.dialogRef.close({ action: 'Task Deleted', task: _task });
            this.handleGetTask();
          }
        }, error => this.loading = false)
      }
    })
  }

  closeDialog() {
    this.dialogRef.close({ action: 'Task Updated', task: this.task });
  }

  changeAssignee(emailId) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to change the Assignee ${this.getMemberName(emailId)}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change!'
    }).then((result) => {
      if (result.value) {

        let taskHistory: TaskHistory = new TaskHistory();

        taskHistory.taskId = this.task.taskId;
        taskHistory.field = 'Changed Assignee';
        taskHistory.historyFrom = this.task.assignee;
        taskHistory.historyTo = emailId;
        taskHistory.updatedBy = this.ts.auth.getLoginEmailId();

        let _task = Object.assign({}, this.task);
        _task.assignee = emailId;
        this.loading = true;
        this.ts.updateTask(_task, taskHistory).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Changed Assignee successfully');
            this.task = resp['Task'];
            this.handleGetTask();
          }
        }, error => this.loading = false)

      }
    })
  }

  changeReporter(emailId) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to change the Reporter ${this.getMemberName(emailId)}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change!'
    }).then((result) => {
      if (result.value) {

        let taskHistory: TaskHistory = new TaskHistory();

        taskHistory.taskId = this.task.taskId;
        taskHistory.field = 'Changed Reporter';
        taskHistory.historyFrom = this.task.reporter;
        taskHistory.historyTo = emailId;
        taskHistory.updatedBy = this.ts.auth.getLoginEmailId();

        let _task = Object.assign({}, this.task);
        _task.reporter = emailId;
        this.loading = true;
        this.ts.updateTask(_task, taskHistory).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Changed Reporter successfully');
            this.task = resp['Task'];
            this.handleGetTask();
          }
        }, error => this.loading = false)

      }
    })
  }

  changeDueDate(event) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to change the due date.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Change!'
    }).then((result) => {
      if (result.value) {

        let taskHistory: TaskHistory = new TaskHistory();

        taskHistory.taskId = this.task.taskId;
        taskHistory.field = 'Changed Due DateTime';
        taskHistory.historyFrom = this.datePipe.transform(this.task.dueDateTime, 'dd/MM/yyyy hh:mm a');
        taskHistory.historyTo = this.datePipe.transform(event.value, 'dd/MM/yyyy hh:mm a');
        taskHistory.updatedBy = this.ts.auth.getLoginEmailId();

        let _task = Object.assign({}, this.task);
        _task.dueDateTime = event.value;
        this.loading = true;
        this.ts.updateTask(_task, taskHistory).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Changed Due DateTime successfully');
            this.task = resp['Task'];
            this.handleGetTask();
          }
        }, error => this.loading = false)

      }
    })
  }

  validateEmail(emailId): boolean {
    if (emailId != null && emailId != undefined && emailId.length > 0) {
      let regex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;
      return regex.test(String(emailId).toLowerCase());
    } else {
      return false;
    }
  }

  openShareWhatsAppModal() {

    this.shareWhatsappText = this.task.subject + '\n' +
      'Task Id : ' + this.task.taskId + '\n\n' +
      'View Task by below url : ' + this.task.taskId + '\n' +
      window.location.origin + '/shared/view-task/' + this.task.taskId + '\n\n'
      + 'Thanks\n' + this.getMemberName(this.ts.auth.getLoginEmailId());

    console.log(this.shareWhatsappText);

    $(function () {
      $('#whatsappShareModal').appendTo("body").modal('show');
    });
  }

  closeWhatsappShareModal() {
    $(function () {
      $('#whatsappShareModal').appendTo("body").modal('hide');
    });
  }

  shareWhatsApp() {
    let url = `https://wa.me/${this.shareWhatsappTo}?text=${encodeURI(this.shareWhatsappText)}`;
    window.open(url, '_blank');
  }

  downloadTaskAttachmnet(attachment) {
    console.log(attachment);
    window.open(environment.contentPath + 'task-attachments/download/' + this.task.taskId + '/' + attachment, '_blank');
  }


  public filesDrop: NgxFileDropEntry[] = [];
  files: Array<fileUpload> = [];
  filesUploaded = 0;

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

            this.ts.uploadTaskAttachments(file, this.task.taskId)
              .subscribe(resp => {
                if (resp.type == HttpEventType.UploadProgress) {
                  _file_upload.progress = Math.round(100 * resp.loaded / resp.total);

                }
                if (resp.type === HttpEventType.Response) {
                  console.log('Upload complete');
                  _file_upload.status = 'Uploaded';
                  this.filesUploaded = this.filesUploaded + 1;
                  this.finishFileUpload();
                }
              });
          }
        });
      }
    }
  }

  finishFileUpload() {
    console.log(this.files.length, this.filesUploaded, this.files.length == this.filesUploaded);
    if (this.files.length == this.filesUploaded) {
      console.log("All Upload Finished::");
      let _attachments = '';
      let _new_attachments = '';
      this.attachments.forEach(attach => { _attachments = _attachments + attach + ';' });
      this.files.forEach(file => { _new_attachments = _new_attachments + file.file.name + ';' });
      _attachments = _attachments + _new_attachments;

      let taskHistory: TaskHistory = new TaskHistory();

      taskHistory.taskId = this.task.taskId;
      taskHistory.field = 'Added Attachments';
      taskHistory.historyFrom = '';
      taskHistory.historyTo = _new_attachments;
      taskHistory.updatedBy = this.ts.auth.getLoginEmailId();

      let _task = Object.assign({}, this.task);
      _task.files = _attachments;
      this.loading = true;
      this.ts.updateTask(_task, taskHistory).subscribe(resp => {
        this.loading = false;
        if (resp['StatusCode'] == '00') {
          this.snackbar.open('Uploaded Files successfully');

          this.files = [];
          this.filesUploaded = 0;

          this.task = resp['Task'];
          this.handleGetTask();
        }
      }, error => this.loading = false)
    }
  }

  removeAttachment(attachment) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to Delete ${attachment}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {

        let taskHistory: TaskHistory = new TaskHistory();

        taskHistory.taskId = this.task.taskId;
        taskHistory.field = 'Deleted Attachment';
        taskHistory.historyFrom = attachment;
        taskHistory.historyTo = '';
        taskHistory.updatedBy = this.ts.auth.getLoginEmailId();

        let _attachments = '';
        this.attachments
          .filter(attach => attach != attachment)
          .forEach(attach => { _attachments = _attachments + attach + ';' });

        let _task = Object.assign({}, this.task);
        _task.files = _attachments;
        this.loading = true;
        this.ts.updateTask(_task, taskHistory).subscribe(resp => {
          this.loading = false;
          if (resp['StatusCode'] == '00') {
            this.snackbar.open('Deleted File successfully');

            this.files = [];
            this.filesUploaded = 0;

            this.task = resp['Task'];
            this.handleGetTask();
          }
        }, error => this.loading = false)

      }
    })

  }

}
