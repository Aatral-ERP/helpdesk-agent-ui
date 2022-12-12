import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { LeadManagementService } from 'src/app/_services/lead-management.service';
import { Lead } from '../lead-create/Lead';
import { LeadMailSentStatus } from '../lead-mail-sent-status/LeadMailSentStatus';
import { LeadMailTemplate } from '../lead-mail-template-create/LeadMailTemplate';
declare var $: any;

@Component({
  selector: 'app-lead-details-mail',
  templateUrl: './lead-details-mail.component.html',
  styleUrls: ['./lead-details-mail.component.css']
})
export class LeadDetailsMailComponent implements OnInit {

  constructor(private lms: LeadManagementService, private snackbar: MatSnackBar) { }

  loading: boolean = false;
  loadingTemplates: boolean = false;
  sendingMail: boolean = false;
  templates: Array<LeadMailTemplate> = [];
  @Input() lead: Lead;
  mailSentStatus: Array<LeadMailSentStatus> = [];

  ngOnInit() {
    this.searchLeadMailSentStatus();
  }

  searchLeadMailSentStatus() {
    this.loading = true; this.mailSentStatus = [];
    this.lms.searchLeadMailSentStatus({ leadId: this.lead.id }).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.mailSentStatus = resp['LeadMailSentStatus'];
        this.mailSentStatus.sort((a, b) => b.id - a.id);
      }
    }, error => this.loading = false)
  }

  getAttachmentssAsArray(sentStatus: LeadMailSentStatus): Array<string> {
    if (sentStatus.files !== undefined && sentStatus.files != null && sentStatus.files != '')
      return sentStatus.files.split(';');
    else
      return [];
  }

  searchLeadMailTemplates() {
    this.showTemplateModal();
    if (this.templates.length > 0)
      return; // didn't loads template every time but loads first time.

    this.loadingTemplates = true;
    this.lms.searchLeadMailTemplates({}).subscribe(resp => {
      this.loadingTemplates = false;
      if (resp['StatusCode'] == '00') {
        this.templates = resp['LeadMailTemplates'];
      }
    }, error => this.loadingTemplates = false)
  }

  sentLeadMailByTemplate(template: LeadMailTemplate) {
    this.hideTemplateModal();
    this.sendingMail = true;
    this.lms.sentLeadMailByTemplate(this.lead.id, template.id).subscribe(resp => {
      this.sendingMail = false;
      if (resp['StatusCode'] == '00') {
        this.mailSentStatus = resp['LeadMailSentStatus'];
        this.snackbar.open('Sent Mail Successfully');
        //Loads the leadMailSentStatus after 2 secs, So that sent status details will saved in db.
        this.loading = true;
        setTimeout(() => this.searchLeadMailSentStatus(), 2000);
      }
    }, error => { this.snackbar.open('Somethig went wrong'); this.sendingMail = false })
  }

  hideTemplateModal() {
    $(function () {
      $('#openMailTemplateModal').appendTo("body").modal('hide');
    });
  }

  showTemplateModal() {
    $(function () {
      $('#openMailTemplateModal').appendTo("body").modal('show');
    });
  }



}
