import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/_services/ticket.service';
import { Base64 } from 'js-base64';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gmail-tickets',
  templateUrl: './gmail-tickets.component.html',
  styleUrls: ['./gmail-tickets.component.css']
})
export class GmailTicketsComponent implements OnInit {

  constructor(private ts: TicketService, private route: Router) { }
  gmailTickets: Array<any> = [];
  ngOnInit() {
    this.getGmailTickets();
  }

  getGmailTickets() {
    this.ts.getGmailTickets().subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.gmailTickets = res['gmails'];

        console.log(this.gmailTickets);
        this.gmailTickets.sort((a, b) => +b.id - +a.id);
        console.log(this.gmailTickets);

        this.gmailTickets.forEach(mail => {
          try {
            if (mail.summary != null)
              mail.summary = Base64.decode(mail.summary);
          } catch (err) { console.log(err); };
        });
      }

    })
  }

  saveAsTicket(gmt) {
    console.log(gmt);
    this.route.navigate(['/add-ticket'], { queryParams: { edit: 1, td: Base64.encode(JSON.stringify(gmt)), tdtype: 'gmailAsTicket' } })
  }

}
