import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TicketService } from 'src/app/_services/ticket.service';
import { TicketServiceInvoice } from 'src/app/_entity/TicketServiceInvoice';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-ticket-service-invoice',
  templateUrl: './add-ticket-service-invoice.component.html',
  styleUrls: ['./add-ticket-service-invoice.component.css']
})
export class AddTicketServiceInvoiceComponent implements OnInit {

  constructor(private ts: TicketService) { }

  @Input() ticketServiceInvoice: TicketServiceInvoice;
  @Output() emitter = new EventEmitter();

  addTicketServiceInvoiceProgress = false;

  ngOnInit() {
  }

  AddTicketServiceInvoice() {
    this.ts.addTicketServiceInvoice(this.ticketServiceInvoice).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.emitter.emit('AddTicketServiceInvoice Success');
      }
    });
  }


  downloadTicketServiceInvoice() {
    if(this.ticketServiceInvoice.id > 0)
    window.open(environment.contentPath + '_service_invoices/' + this.ticketServiceInvoice.invoiceNo + '.pdf', '_blank');
  }

}
