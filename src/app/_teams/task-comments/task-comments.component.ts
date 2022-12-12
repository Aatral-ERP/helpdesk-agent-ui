import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { TeamsService } from 'src/app/_services/teams.service';
import { environment } from 'src/environments/environment';
import { Task } from '../task-create/Task';
import { TaskComments } from './TaskComments';

@Component({
  selector: 'app-task-comments',
  templateUrl: './task-comments.component.html',
  styleUrls: ['./task-comments.component.css']
})
export class TaskCommentsComponent implements OnInit {

  constructor(private ts: TeamsService, private snackbar: MatSnackBar) { }

  @Input() task: Task;
  @Input() canCommentTask: boolean;

  @Input() set allAgents(allAgents: Array<Agent>) {
    console.log("allAgents Input Received::", allAgents);
    this.agents = allAgents;
  };

  comments: Array<TaskComments> = [];
  agents: Array<Agent> = [];

  comment = '';
  showAddComment = false;
  loading = false;
  saving = false;
  sortingOrder = 'new-first';

  ngOnInit() {
    this.getAllTaskComments();
  }

  getAllTaskComments() {
    this.loading = true;
    this.ts.getAllTaskComments(this.task.taskId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.comments = resp['TaskComments'];
        this.sortComments(this.sortingOrder);
      }
    }, error => this.loading = false);
  }

  sortComments(order) {
    console.log(order);
    this.sortingOrder = order;
    if (this.sortingOrder == 'new-first')
      this.comments
        .sort((a, b) => +new Date(b.createddatetime) - +new Date(a.createddatetime))
        .forEach(cmnt => cmnt.comment = cmnt.comment.replace(/(?:\r\n|\r|\n)/g, '<br>'));
    else
      this.comments
        .sort((a, b) => +new Date(a.createddatetime) - +new Date(b.createddatetime))
        .forEach(cmnt => cmnt.comment = cmnt.comment.replace(/(?:\r\n|\r|\n)/g, '<br>'));
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

  saveTaskComment() {
    let _comment: TaskComments = new TaskComments();
    _comment.comment = this.comment;
    _comment.commentBy = this.ts.auth.getLoginEmailId();
    _comment.taskId = this.task.taskId;

    this.saving = true;
    this.ts.saveTaskComment(_comment).subscribe(resp => {
      this.saving = false;
      if (resp['StatusCode'] == '00') {
        this.showAddComment = false;
        this.snackbar.open('Comment Saved Successfully')
        _comment = resp['TaskComments'];
        this.comments.push(_comment);
        this.sortComments(this.sortingOrder);
      }
    }, error => this.saving = false);
  }

}
