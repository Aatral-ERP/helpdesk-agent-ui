import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Agent } from '../_profile/agent-profile/Agent';
import { TaskComments } from '../_teams/task-comments/TaskComments';
import { Task } from '../_teams/task-create/Task';
import { TaskHistory } from '../_teams/task-history/TaskHistory';
import { TeamEmailSetting } from '../_teams/team-email-notification-settings/TeamEmailSetting';
import { TeamMembers } from '../_teams/team-members/TeamMembers';
import { TeamPushNotifySetting } from '../_teams/team-push-notification-settings/TeamPushNotifySetting';
import { TeamSetting } from '../_teams/team-settings/TeamSetting';
import { Teams } from '../_teams/teams/Teams';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  constructor(public auth: AuthService, private http: HttpClient) { }

  agents: Array<Agent> = [];

  getAllMyTeams() {
    return this.http.post(environment.apiUrl + 'teams/get-all-my-teams', this.auth.getAgentMinDetails());
  }

  saveTeam(team: Teams) {
    if (team.id == 0) {
      team.leadEmail = this.auth.getLoginEmailId();
      team.leadName = this.auth.getLoginAgentFullName();
    }
    let req = { teams: team, agent: this.auth.getAgentDetails() };
    return this.http.post(environment.apiUrl + 'teams/save-team', req);
  }

  getTeam(id) {
    return this.http.get(environment.apiUrl + 'teams/get-team/' + id);
  }

  addTeamMember(team: Teams, agent: Agent, member: TeamMembers) {
    let req = { teams: team, agent: agent, teamMember: member };
    return this.http.post(environment.apiUrl + 'teams/add-team-members', req);
  }

  deleteTeamMember(team: Teams, member: TeamMembers) {
    let req = { teams: team, agent: this.auth.getAgentDetails(), teamMember: member };
    return this.http.post(environment.apiUrl + 'teams/delete-team-members', req);
  }

  getTeamMembers(teamId) {
    return this.http.get(environment.apiUrl + 'teams/get-team-members/' + teamId);
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
      return agent.firstName + ' ' + agent.lastName + '<' + agent.emailId + '>';
    else
      return emailId;
  }

  loadTeamSetting(teamId) {
    return this.http.get(environment.apiUrl + 'teams/get-team-setting/' + teamId);
  }

  saveTeamSetting(team: Teams, teamSetting: TeamSetting) {
    teamSetting.lastUpdatedBy = this.auth.getLoginEmailId();
    let req = { teams: team, teamSetting: teamSetting, agent: this.auth.getAgentDetails() };

    return this.http.post(environment.apiUrl + 'teams/save-team-setting', req);
  }

  loadTeamEmailSetting(teamId) {
    return this.http.get(environment.apiUrl + 'teams/get-team-email-setting/' + teamId);
  }

  saveTeamEmailSetting(team: Teams, teamEmailSettings: Array<TeamEmailSetting>) {
    let req = { teams: team, teamEmailSettings: teamEmailSettings, agent: this.auth.getAgentDetails() };
    return this.http.post(environment.apiUrl + 'teams/save-team-email-setting', req);
  }

  loadTeamPushNotifySetting(teamId) {
    return this.http.get(environment.apiUrl + 'teams/get-team-push-notify-setting/' + teamId);
  }

  saveTeamPushNotifySetting(team: Teams, teamPushNotifySettings: Array<TeamPushNotifySetting>) {
    let req = { teams: team, teamPushNotifySettings: teamPushNotifySettings, agent: this.auth.getAgentDetails() };
    return this.http.post(environment.apiUrl + 'teams/save-team-push-notify-setting', req);
  }

  getRandomString(length): string {
    var result = [];
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() *
        charactersLength)));
    }
    return result.join('');
  }

  uploadTaskAttachments(file, directoryName) {
    let form = new FormData();
    form.append('file', file);
    form.append('directoryName', directoryName);
    const url = environment.apiUrl + '/tasks/upload-task-attachments';
    const req = new HttpRequest('POST', url, form, {
      reportProgress: true
    });
    return this.http.request(req);
  }

  createTask(task: Task, directoryName: string) {
    task.lastUpdatedBy = this.auth.getLoginEmailId();
    if (task.taskId == 0) {
      task.createdBy = this.auth.getLoginEmailId();
    }
    let req = { task: task, directoryName: directoryName };
    return this.http.post(environment.apiUrl + 'tasks/create-task', req);
  }

  loadTeamTasks(team: Teams, teamMember: TeamMembers) {
    let req = { task: { teamId: team.id }, teamMember: teamMember };
    return this.http.post(environment.apiUrl + 'tasks/get-team-tasks', req);
  }

  getTask(taskId) {
    return this.http.get(environment.apiUrl + 'tasks/get-task/' + taskId);
  }

  updateTask(task: Task, taskHistory: TaskHistory) {
    let req = { task: task, taskHistory: taskHistory };
    return this.http.post(environment.apiUrl + 'tasks/update-task', req);
  }

  deleteTask(task: Task) {
    let req = { task: task };
    return this.http.post(environment.apiUrl + 'tasks/delete-task', req);
  }

  getTaskHistory(taskId) {
    return this.http.get(environment.apiUrl + 'tasks/get-task-history/' + taskId);
  }

  getAllTaskComments(taskId) {
    return this.http.get(environment.apiUrl + 'tasks/get-all-task-comments/' + taskId);
  }

  saveTaskComment(comment: TaskComments) {
    return this.http.post(environment.apiUrl + 'tasks/save-task-comment', comment);
  }

  loadTaskNeeded(req) {
    return this.http.post(environment.apiUrl + 'tasks/get-task-search-needed', req);
  }

  searchTeamTasks(req) {
    return this.http.post(environment.apiUrl + 'tasks/search-team-tasks', req);
  }

  getMyCalendarTasksEvents(req) {
    return this.http.post(environment.apiUrl + 'tasks/get-my-calendar-tasks-events', req);
  }

}
