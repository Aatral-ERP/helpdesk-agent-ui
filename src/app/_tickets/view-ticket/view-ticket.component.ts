import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { TicketService } from 'src/app/_services/ticket.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'
import { Ticket } from '../Ticket';
import { TicketServiceInvoice } from 'src/app/_entity/TicketServiceInvoice';
import { environment } from 'src/environments/environment';
import { Base64 } from 'js-base64';
import { SalesService } from 'src/app/_services/sales.service';
import { AuthService } from 'src/app/_services/auth.service';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.css']
})
export class ViewTicketComponent implements OnInit {

  constructor(private ts: TicketService, private router: Router, public auth: AuthService,
    private ss: SalesService, private route: ActivatedRoute, private tst: ToastrService,
    public dialogRef: MatDialogRef<ViewTicketComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  loading = false;
  ticket: Ticket = new Ticket;
  ticketAttachments: Array<any> = [];
  ticketReplies: Array<any> = [];

  modifyAccess = false;
  role: RoleMaster = this.auth.getLoggedInRole();

  agentName = '';
  _agents = [];
  reply = '';

  defaultTime = [18, 0, 0];

  @ViewChild('attachment', { static: false }) attachmentRef: ElementRef;
  attachmentsInProgress = false;
  replyInProgress = false;
  showReply = false;
  closeTicketProgress = false;
  holdTicketProgress = false;

  addTicketServiceInvoiceProgress = false;
  showAddTicketServiceInvoice = false;

  ticketServiceInvoice: TicketServiceInvoice;

  ngOnInit() {
    let ticketId = '0';
    console.log(this.data);
    console.log(ticketId);

    if (this.data.ticketId) {
      ticketId = this.data.ticketId + '';
      this.getTicketDetails(ticketId);
    } else {
      this.route.params.subscribe(param => {
        console.log(param);
        ticketId = param['id'];
        this.getTicketDetails(ticketId);
      })
    }
  }

  getTicketDetails(ticketId) {

    this.loading = true;

    this.ts.getTicketDetails(ticketId).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        this.ticket = res['Ticket'];
        this.ticketAttachments = res['TicketAttachments'];
        this.ticketReplies = res['TicketReply'];
        this.ticketReplies.sort((a, b) => b.id - a.id).forEach(rep => rep.reply = rep.reply.replace(/(?:\r\n|\r|\n)/g, '<br>'));

        if (this.ticket.assignedTo == this.auth.getLoginEmailId()
          || this.ticket.createdBy == this.auth.getLoginEmailId()
          || this.ticket.assignedBy == this.auth.getLoginEmailId()
          || this.role.tickets == 'Full Access') {
          this.modifyAccess = true;
        } else {
          this.modifyAccess = false;
        }

        if (res['TicketServiceInvoice'] != null) {
          this.ticketServiceInvoice = res['TicketServiceInvoice'];
        } else {
          this.ticketServiceInvoice = new TicketServiceInvoice(this.ticket, this.ticket.product, this.ts.auth.getLoginEmailId());
        }

      }
    }, error => this.loading = false);
  }

  AddTicketServiceInvoiceEmitted(event) {
    console.log(event);
    this.tst.info(event);
    this.showAddTicketServiceInvoice = false;
    this.ngOnInit();
  }

  fileChange(event) {
    console.log(event);
    if (event.target && event.target.files) {
      console.log("Inside Event Target");
      const selectedFile: Array<any> = event.target.files;
      console.log(selectedFile.length);
      if (selectedFile.length == 0)
        return;
      let successCount = 0; let failedCount = 0;
      this.attachmentsInProgress = true;
      selectedFile.forEach(file => {
        this.ts.AddTicketAttachment(this.ticket.ticketId, file).subscribe(rs => {
          successCount = successCount + 1;
          this.finishAddAttachmentResponse(selectedFile.length, successCount, failedCount);
        }, error => {
          failedCount = failedCount + 1;
          this.finishAddAttachmentResponse(selectedFile.length, successCount, failedCount);
        });
      })
    }
  }

  finishAddAttachmentResponse(totalCount, successCount, failedCount) {
    let successFailedCount = +successCount + +failedCount;
    console.log(totalCount, successCount, failedCount, totalCount == successFailedCount)
    if (totalCount == successFailedCount) {
      this.attachmentsInProgress = false;
      this.attachmentRef.nativeElement.value = '';
      this.tst.info(successCount + ' files  uploaded successfully , ' + failedCount + ' failed.')
      if (successCount > 0)
        this.ngOnInit();
    }
  }

  onButtonClick() {
    console.log('INSIDE');
    document.getElementById('textInput').className = "show";
  }

  downloadTicketAttachmnet(attachment) {
    console.log(attachment);
    window.open(environment.contentPath + attachment['ticket']['ticketId'] + '/' + attachment['fileName'], '_blank');
  }

  sendReply() {
    if (this.reply == '')
      return;

    console.log(this.reply);
    this.replyInProgress = true;
    this.ts.addTicketReply(this.reply, this.ticket).subscribe(res => {
      console.log(res); this.replyInProgress = false;
      if (res['StatusCode'] == '00') {
        this.ngOnInit();
        this.reply = '';
        this.replyInProgress = false;
        this.showReply = false;
      }
    }, error => { console.log(error); this.replyInProgress = false; })

  }

  markAsCompleted() {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will Marked as Completed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.closeTicketProgress = true;
        this.ts.markAsCompleted(this.ticket).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire('Marked as Completed Successfully', '', 'success');
            this.ticket = res['Tickets'];
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

  closeTicket() {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will make ticket closed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Close it!'
    }).then((result) => {
      if (result.value) {
        this.closeTicketProgress = true;
        this.ts.closeTicket(this.ticket).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire('Closed the ticket Successfully', '', 'success');
            this.ticket = res['Tickets'];
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

  reopenTicket() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to reopen this ticket",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.closeTicketProgress = true;
        this.ts.reopenTicket(this.ticket).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire('ReOpened the ticket Successfully', '', 'success');
            this.ticket = res['Tickets'];
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

  dateChange(event) {
    this.ticket.dueDateTime = event;
    this.openassignTicketToAgentModal();
  }

  openassignTicketToAgentModal() {

    if (this._agents.length == 0) {
      this.ss.getSalesNeededData(['agents']).subscribe(res => {
        console.log(res);
        this._agents = res['Agents'];
      });
    }

    $(function () {
      $('#agentaddmodal').appendTo("body").modal('show');
    });
  }

  assignTicketToMe() {
    this.assignTicketToAgent(this.auth.getAgentDetails())
  }

  assignBackTicket() {
    let agent = {};

    if (this._agents.length == 0) {
      this.ss.getSalesNeededData(['agents']).subscribe(res => {
        this._agents = res['Agents'];
        agent = this._agents.find(agent => agent.emailId == this.ticket.assignedTo);
        console.log(agent);
        this.assignTicketToAgent(agent)
      });
    } else {
      agent = this._agents.find(agent => agent.emailId == this.ticket.assignedTo);
      console.log(agent);
      this.assignTicketToAgent(agent)
    }

  }

  assignTicketToAgent(agent) {

    $(function () {
      $('#agentaddmodal').appendTo("body").modal('hide');
    });
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to Assign this ticket to " + agent.firstName + " <" + agent.emailId + ">",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.closeTicketProgress = true;
        this.ts.assignTicketToAgent(this.ticket, agent).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire('Assigned the ticket Successfully to you', '', 'success');
            this.ticket = res['Tickets'];
            this.onModalClose();
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

  markAsWaitingForClientReply() {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will Mark status as Waiting_For_Client_Reply.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes!'
    }).then((result) => {
      if (result.value) {
        this.ts.markAsWaitingForClientReply(this.ticket).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            this.ticket = res['Tickets'];
            Swal.fire('Marked the ticket as Waiting_For_Client_Reply Successfully', '', 'success');
            this.onModalClose();
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

  holdTicket() {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will make ticket Hold.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Hold it!'
    }).then((result) => {
      if (result.value) {
        this.holdTicketProgress = true;
        this.ts.holdTicket(this.ticket).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            this.ticket = res['Tickets'];
            Swal.fire('Hold the ticket Successfully', '', 'success');
            this.onModalClose();
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

  rejectTicket() {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will Reject the ticket .",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject it!'
    }).then((result) => {
      if (result.value) {
        this.holdTicketProgress = true;
        this.ts.rejectTicket(this.ticket).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire('Rejected the ticket Successfully', '', 'success');
            this.onModalClose();
            this.ticket = res['Tickets'];
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

  cancelAssignedTicket() {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will Cancel the Ticket and Status will be changed as 'Raised'.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Cancel it!'
    }).then((result) => {
      if (result.value) {
        this.holdTicketProgress = true;
        this.ts.cancelAssignedTicket(this.ticket).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire('Rejected the ticket Successfully', '', 'success');
            this.onModalClose();
            this.ticket = res['Tickets'];
          } else if (res['StatusCode'] == '03') {
            Swal.fire(res['StatusDesc'], '', 'error');
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

  editTicket() {
    let _ticket: Ticket = Object.assign({}, this.ticket);
    _ticket.subject = Base64.decode(_ticket.subject);
    _ticket.summary = Base64.decode(_ticket.summary);
    this.router.navigate(['/add-ticket'], { queryParams: { edit: 1, td: Base64.encode(JSON.stringify(_ticket)), tdtype: 'ticketedit' } })
  }

  onModalClose() {
    this.dialogRef.close(this.ticket);
  }

}
