import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { UtilService } from './util.service';
import { Lead } from '../_lead-management/lead-create/Lead';
import { LeadTask } from '../_lead-management/lead-task/LeadTask';
import { LeadMeeting } from '../_lead-management/lead-meeting/LeadMeeting';
import { LeadMailTemplate } from '../_lead-management/lead-mail-template-create/LeadMailTemplate';
import { LeadContact } from '../_lead-management/lead-contact/LeadContact';

@Injectable({
  providedIn: 'root'
})
export class LeadManagementService {

  constructor(public auth: AuthService, private http: HttpClient, public util: UtilService) { }

  uploadLeadAttachment(file, directoryName) {
    let form = new FormData();
    form.append('file', file);
    form.append('directoryName', directoryName);
    const url = environment.apiUrl + 'lead-management/upload-lead-attachments';
    const req = new HttpRequest('POST', url, form, {
      reportProgress: true
    });
    return this.http.request(req);
  }

  uploadLeadMailTemplateAttachment(file, directoryName) {
    let form = new FormData();
    form.append('file', file);
    form.append('directoryName', directoryName);
    const url = environment.apiUrl + 'lead-mail/upload-lead-mail-template-attachments';
    const req = new HttpRequest('POST', url, form, {
      reportProgress: true
    });
    return this.http.request(req);
  }

  createLead(lead: Lead, leadContacts: Array<LeadContact>, directoryName: string) {
    return this.http.post(environment.apiUrl + 'lead-management/create-lead', { lead: lead, leadContacts: leadContacts, directoryName: directoryName });
  }

  updateLead(lead: Lead, contacts: Array<LeadContact>) {
    return this.http.post(environment.apiUrl + 'lead-management/update-lead', { lead: lead, leadContacts: contacts });
  }

  getLead(leadId) {
    return this.http.get(environment.apiUrl + 'lead-management/get-lead/' + leadId);
  }

  deleteLead(lead: Lead) {
    return this.http.post(environment.apiUrl + 'lead-management/delete-lead', { lead: lead });
  }

  searchLeads(_filters) {
    return this.http.post(environment.apiUrl + 'lead-management/search-leads', _filters);
  }

  saveLeadTask(task: LeadTask) {
    return this.http.post(environment.apiUrl + 'lead-management/save-lead-task', { leadTask: task });
  }

  deleteLeadTask(task: LeadTask) {
    return this.http.post(environment.apiUrl + 'lead-management/delete-lead-task', { leadTask: task });
  }

  loadLeadTasks(leadId) {
    return this.http.get(environment.apiUrl + 'lead-management/get-lead-tasks/' + leadId);
  }

  saveLeadMeeting(meeting: LeadMeeting) {
    return this.http.post(environment.apiUrl + 'lead-management/save-lead-meeting', { leadMeeting: meeting });
  }

  deleteLeadMeeting(meeting: LeadMeeting) {
    return this.http.post(environment.apiUrl + 'lead-management/delete-lead-meeting', { leadMeeting: meeting });
  }

  loadLeadMeetings(leadId) {
    return this.http.get(environment.apiUrl + 'lead-management/get-lead-meetings/' + leadId);
  }

  saveMailTemplate(leadMailTemplate: LeadMailTemplate, directoryName: string) {
    return this.http.post(environment.apiUrl + 'lead-mail/save-lead-mail-template', { leadMailTemplate: leadMailTemplate, directoryName: directoryName });
  }

  deleteMailTemplate(mailTemplate: LeadMailTemplate) {
    return this.http.post(environment.apiUrl + 'lead-mail/delete-lead-mail-template', mailTemplate);
  }

  searchLeadMailTemplates(_filters) {
    return this.http.post(environment.apiUrl + 'lead-mail/search-lead-mail-templates', _filters);
  }

  searchLeadMailSentStatus(_filters) {
    return this.http.post(environment.apiUrl + 'lead-mail/search-lead-mail-sent-status', _filters);
  }

  sentLeadMailByTemplate(leadId, templateId) {
    return this.http.post(environment.apiUrl + 'lead-mail/sent-lead-mail-by-template/' + leadId + '/' + templateId, null);
  }

  uploadLeadDetails(file) {
    let form = new FormData();
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'lead-management/upload-lead-details', form);
  }

  loadLeadDashboardData(_filters) {
    return this.http.post(environment.apiUrl + 'lead-management/dashboard-data', _filters);
  }

}
