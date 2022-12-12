import { Component, Input, OnInit } from '@angular/core';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { TeamsService } from 'src/app/_services/teams.service';
import { environment } from 'src/environments/environment';
import { Task } from '../task-create/Task';
import { TaskHistory } from './TaskHistory';

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['./task-history.component.css']
})
export class TaskHistoryComponent implements OnInit {

  constructor(private ts: TeamsService) { }

  @Input() task: Task;
  @Input() set allAgents(allAgents: Array<Agent>) {
    console.log("allAgents Input Received::", allAgents);
    this.agents = allAgents;
  };

  history: Array<TaskHistory> = [];
  agents: Array<Agent> = [];
  loading = false;
  sortingOrder = 'new-first';

  ngOnInit() {
    this.loading = true;
    this.ts.getTaskHistory(this.task.taskId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.history = resp['TaskHistory'];
        this.sortHistory(this.sortingOrder);
      }
    }, error => this.loading = false);
  }

  sortHistory(order) {
    console.log(order);
    this.sortingOrder = order;
    if (this.sortingOrder == 'new-first')
      this.history.sort((a, b) => +new Date(b.createddatetime) - +new Date(a.createddatetime));
    else
      this.history.sort((a, b) => +new Date(a.createddatetime) - +new Date(b.createddatetime));
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

  getSemicolonReplacedHTMLText(text) {
    if (text !== undefined && text != null && text != '') {
      return text.replace(/;/g, '<br>')
    } else {
      return "-";
    }


  }
}
