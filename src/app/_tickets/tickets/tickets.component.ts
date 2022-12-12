import { Component, OnInit } from '@angular/core';
import { Ticket } from './Ticket';
import { ToastrService } from 'ngx-toastr';
import { TicketRoutingModule } from 'src/app/ticket-routing.module';
import { TicketService } from 'src/app/_services/ticket.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  // searchResultsCount = 15;
  // setCount = true;
  // date = '10/08/2020';
  // serviceType = 'Re-Installation';
  // summary = 'Need to Install New Software ';
  // amcwar = 'AMC';
  // status = 'Assigned';
  // ticketNo = '122002'
  // currentPage = 1;
  // perPage = 15;
  // set_from = 0;
  // open = '0';
  // closed = '1';
  // assigned = '2';


  // set_to = this.perPage;

  // loading = false;
  // searchResults = [];

  TicketStatus = {
    Raised: 0, Assigned: 0, Rejected: 0, Closed: 0, Hold: 0, Waiting_For_Client_Reply: 0,ReOpened:0
  }
  statusSelected = 'Raised';
  tickets: Array<Ticket> = [];

  constructor(private ts: TicketService) { }

  ngOnInit(): void {
    // this.getAllInstitutionTickets();
    this.subscribeToTickets();
  }

  subscribeToTickets() {
    this.ts.subscribeToTickets().subscribe(tickets => {
      console.log(tickets);
      this.tickets = [];
      this.tickets = tickets;
      this.GetTicketStatusCount();
    });
  }

  getAllInstitutionTickets() {
    this.ts.getAllInstitutionTickets().subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.tickets = res['Tickets'];
        console.log(this.tickets);
        this.tickets.sort((a, b) => b.ticketId - a.ticketId);
        this.GetTicketStatusCount();
      }
    });
  }

  GetTicketStatusCount() {
    this.TicketStatus = {
      Raised: 0, Assigned: 0, Rejected: 0, Closed: 0, Hold: 0, Waiting_For_Client_Reply: 0,ReOpened:0
    }
    this.tickets.forEach(ticket => {
      this.TicketStatus[ticket.status] = +this.TicketStatus[ticket.status] + 1;
    })
  }


}
