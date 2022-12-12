import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AddTicket } from '../_tickets/add-ticket/AddTicket';
import { Base64 } from 'js-base64';
import { Ticket } from '../_tickets/Ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(public auth: AuthService, private http: HttpClient) { }

  getHomeScreenDetails() {
    return this.http.post(environment.apiUrl + 'agent/get-home-page-details', this.auth.getAgentDetails());
  }

  loadAMCExpiryReminder() {
    return this.http.post(environment.apiUrl + 'institute/get-institute-products-expiry-reminder', {});
  }

  AddTicket(ticket) {
    let _ticket: Ticket = Object.assign({}, ticket);
    _ticket.subject = Base64.encode(_ticket.subject);
    _ticket.summary = Base64.encode(_ticket.summary);
    _ticket.createdBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + 'ticket/add-ticket', _ticket);
  }

  AddSimpleSelfTicket(ticket) {
    let _ticket: Ticket = Object.assign({}, ticket);
    _ticket.subject = Base64.encode(_ticket.subject);
    _ticket.summary = Base64.encode(_ticket.summary);
    _ticket.createdBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + 'ticket/add-simple-ticket', _ticket);
  }

  AddTicketAttachment(ticketId, file) {
    let form = new FormData();
    form.append('ticketId', ticketId);
    form.append('file', file);
    return this.http.post(environment.apiUrl + 'ticket/add-ticket-attachment', form);
  }

  getAllInstitutionTickets(inst) {
    return this.http.post(environment.apiUrl + 'ticket/get-all-institute-tickets', { institute: inst });
  }

  getTicketDetails(ticketId) {
    return this.http.post(environment.apiUrl + 'ticket/get-ticket', { ticketId: ticketId });
  }

  addTicketReply(reply, ticket) {
    let request = {
      reply: reply,
      replyBy: this.auth.getLoginEmailId(),
      ticket: ticket
    }
    return this.http.post(environment.apiUrl + 'ticket/add-ticket-reply', request);
  }

  saveGmailAsTicket(ticket, gmailAsTicket) {
    let _ticket = Object.assign({}, ticket);
    let request = {
      ticket: _ticket,
      gmailAsTicket: gmailAsTicket
    }
    return this.http.post(environment.apiUrl + 'ticket/save-gmail-as-ticket', request);

  }

  updateTicket(ticket) {
    let _ticket = Object.assign({}, ticket);
    let request = {
      ticket: _ticket,
      agent: this.auth.getAgentDetails()
    }
    return this.http.post(environment.apiUrl + 'ticket/update-ticket', request);
  }

  closeTicket(ticket) {
    let _ticket = Object.assign({}, ticket);
    _ticket['status'] = 'Closed';
    _ticket['closedDateTime'] = new Date();
    let request = {
      ticket: _ticket,
      agent: this.auth.getAgentDetails()
    }
    return this.http.post(environment.apiUrl + 'ticket/update-ticket', request);
  }

  markAsCompleted(ticket) {
    let _ticket = Object.assign({}, ticket);
    _ticket['status'] = 'Marked_As_Completed';
    let request = {
      ticket: _ticket,
      agent: this.auth.getAgentDetails()
    }
    return this.http.post(environment.apiUrl + 'ticket/update-ticket', request);
  }

  reopenTicket(ticket) {
    let _ticket = Object.assign({}, ticket);
    _ticket['status'] = 'ReOpened';

    let request = {
      ticket: _ticket,
      agent: this.auth.getAgentDetails()
    }
    return this.http.post(environment.apiUrl + 'ticket/update-ticket', request);
  }

  assignTicketToAgent(ticket, agent) {
    let _ticket = Object.assign({}, ticket);
    _ticket['status'] = 'Assigned';
    _ticket['assignedBy'] = this.auth.getLoginEmailId();
    _ticket['lastUpdatedBy'] = this.auth.getLoginEmailId();
    _ticket['assignedDateTime'] = new Date();

    let request = {
      ticket: _ticket,
      agent: agent
    }
    return this.http.post(environment.apiUrl + 'ticket/assign-ticket', request);
  }

  // assignTicketToMe(ticket) {
  //   let _ticket = Object.assign({}, ticket);
  //   _ticket['status'] = 'ReOpened';

  //   let request = {
  //     ticket: _ticket,
  //     agent: this.auth.getAgentDetails()
  //   }
  //   return this.http.post(environment.apiUrl + 'ticket/assign-ticket', request);
  // }

  holdTicket(ticket) {
    let _ticket = Object.assign({}, ticket);
    _ticket['status'] = 'Hold';

    let request = {
      ticket: _ticket,
      agent: this.auth.getAgentDetails()
    }
    return this.http.post(environment.apiUrl + 'ticket/update-ticket', request);
  }

  markAsWaitingForClientReply(ticket) {
    let _ticket = Object.assign({}, ticket);
    _ticket['status'] = 'Waiting_For_Client_Reply';

    let request = {
      ticket: _ticket,
      agent: this.auth.getAgentDetails()
    }
    return this.http.post(environment.apiUrl + 'ticket/update-ticket', request);
  }

  rejectTicket(ticket) {
    let _ticket = Object.assign({}, ticket);
    _ticket['status'] = 'Rejected';

    let request = {
      ticket: _ticket,
      agent: this.auth.getAgentDetails()
    }
    return this.http.post(environment.apiUrl + 'ticket/update-ticket', request);
  }

  cancelAssignedTicket(ticket) {
    let _ticket = Object.assign({}, ticket);
    _ticket['status'] = 'Raised';
    _ticket['assignedTo'] = null;

    let request = {
      ticket: _ticket,
      agent: this.auth.getAgentDetails()
    }
    return this.http.post(environment.apiUrl + 'ticket/update-ticket', request);
  }

  getTicketsReportData() {
    return this.http.post(environment.apiUrl + 'ticket/get-ticket-report-data', {});
  }

  getTicketsReport(request) {
    return this.http.post(environment.apiUrl + 'ticket/get-ticket-report', request);
  }

  addTicketServiceInvoice(ticketServiceInvoice) {
    ticketServiceInvoice.generatedBy
    return this.http.post(environment.apiUrl + 'ticket/send-ticket-invoice', ticketServiceInvoice);
  }

  getAddTicketEmptyEntity(): AddTicket {

    let addTicket = new AddTicket;
    addTicket.priority = "NotPreferred";
    addTicket.status = 'Raised';
    addTicket.emailId = this.auth.getLoginEmailId();

    //let claims = this.auth.getInstituteDetails();
    // addTicket.instituteId = claims['instituteId'];
    // addTicket.instituteName = claims['instituteName'];
    // addTicket.emailId = this.auth.getLoginEmailId();
    // addTicket.serviceUnder = claims['serviceUnder'];
    // console.log(claims['serviceUnder']);
    // addTicket.institute = claims;

    return addTicket;
  }

  getInstituteProducts(instituteDetails) {
    console.log(instituteDetails);
    let request = { institute: { "instituteId": instituteDetails['instituteId'] } };
    return this.http.post(environment.apiUrl + 'institute/get-institute-products',
      request);
  }

  getGmailTickets() {
    return this.http.post(environment.apiUrl + 'gmail-ticket/get-all-gmails', {});
  }

  getAgentReport(request) {
    return this.http.post(environment.apiUrl + 'agent/get-agent-report', request);
  }


  getAgentDetails(req) {
    return this.http.post(environment.apiUrl + 'ticket/get-ticket-dashboard-details', req);
  }

  getAgentPerformanceDetails(agent) {
    let req = { agent: agent };
    return this.http.post(environment.apiUrl + 'ticket/get-agent-performance-details', req);

  }

  serviceReport(filters) {
    let request = filters;
    return this.http.post(environment.apiUrl + 'ticket/service-report', request);
  }

  
  saveCallReport(callrepo) {
    return this.http.post(environment.apiUrl + 'ticket/save-call-report', callrepo);
  }

  getCallreport(instituteId) {
    return this.http.get(environment.apiUrl + 'ticket/get-call-report/' + instituteId);
  }

  generateCallReport(id, addSign, addRoundSeal, addFullSeal) {
    let request = { id: id, addSign: addSign, signatureBy: this.auth.getLoginEmailId(), addRoundSeal: addRoundSeal, addFullSeal: addFullSeal };
    return this.http.post(environment.apiUrl + 'ticket/get-call-report-pdf', request);
  }

  UploadGeneratedCallReportPDF(id, file) {
    let form = new FormData();
    form.append('file', file);
    form.append('id', id);
    return this.http.post(environment.apiUrl + 'ticket/save-call-report-attachment', form);
  }

  deleteCallReport(id) {
    let request = {
      "id": id
    };
    return this.http.post(environment.apiUrl + 'ticket/call-report', request);
  }



  loadLetterpad() {
    return this.http.get(environment.apiUrl + 'accounts/get-all-letterpad');
  }

  saveLetterpad(letterpad) {
    return this.http.post(environment.apiUrl + 'accounts/save-letterpad', letterpad);
  }


  deleteLetterpad(id) {
    let request = {
      "id": id
    };
    return this.http.post(environment.apiUrl + 'accounts/delete-letterpad', request);
  }

  getLetterpad(id) {
    return this.http.get(environment.apiUrl + 'accounts/get-letterpad/' + id);
  }

  generateLetterPad(id, addSign, addRoundSeal, addFullSeal,addLetterHead,addLogo,designation) {
    let request = { id: id, addSign: addSign, signatureBy: this.auth.getLoginEmailId(), addRoundSeal: addRoundSeal, addFullSeal: addFullSeal,addLetterHead:addLetterHead,addLogo:addLogo,designation:designation };
    return this.http.post(environment.apiUrl + 'accounts/get-letterpad-pdf', request);
  }

}
