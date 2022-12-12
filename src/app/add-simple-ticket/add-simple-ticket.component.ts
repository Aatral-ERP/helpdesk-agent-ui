import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { AddProductComponent } from '../_product/add-product/add-product.component';
import { TicketService } from '../_services/ticket.service';
import { Ticket } from '../_tickets/Ticket';

@Component({
  selector: 'app-add-simple-ticket',
  templateUrl: './add-simple-ticket.component.html',
  styleUrls: ['./add-simple-ticket.component.css']
})
export class AddSimpleTicketComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddProductComponent>,
    private ts: TicketService, private route: Router,
    private snackbar: MatSnackBar) { }

  submitInProgress = false;

  ticket: Ticket = new Ticket();
  ngOnInit() {
  }

  saveTicket() {

    if (this.ticket.subject == '') {
      this.snackbar.open('Subject cannot be empty');
      return;
    }
    this.ticket.serviceUnder = 'Warranty';
    this.ticket.serviceType = 'Others';
    this.ticket.emailId = this.ts.auth.getLoginEmailId();
    this.ticket.instituteId = "";
    this.ticket.product = '';
    this.ticket.priority = 'NotPreferred';
    this.ticket.status = 'Raised';
    this.ticket.assignedTo = this.ts.auth.getLoginEmailId();
    this.ticket.assignedBy = this.ts.auth.getLoginEmailId();

    this.submitInProgress = true;
    this.ts.AddSimpleSelfTicket(this.ticket).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this.route.navigateByUrl('/view-ticket/' + res['Ticket']['ticketId']);
        this.dialogRef.close({ action: 'Ticket Created', ticket: res['Ticket'] });
      } else {
        this.snackbar.open('Something went wrong');
      }
    }, error => this.submitInProgress = false);
  }

}
