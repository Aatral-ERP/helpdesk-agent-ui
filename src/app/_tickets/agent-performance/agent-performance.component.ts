import { Component, Input, OnInit } from '@angular/core';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { TicketService } from 'src/app/_services/ticket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agent-performance',
  templateUrl: './agent-performance.component.html',
  styleUrls: ['./agent-performance.component.css']
})
export class AgentPerformanceComponent implements OnInit {

  constructor(private ts: TicketService) { }

  loading = false;

  @Input() agent: Agent;

  pendingTicketsStatusCounts: Array<any> = [];
  pendingTicketsPriorityCounts: Array<any> = [];
  periodicallyClosedCounts: Array<any> = [];
  ticketRatingCounts: Array<any> = [];
  finalRatings: number = 0.0;
  totalTicketRatingCounts: number = 0;
  lastUpdatedDateTime = null;

  piechartview: any[] = [370, 200];
  colorSchemeAtt = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#990000', '#264d00', '#000066', '#e65c00']
  };

  ngOnInit() {

    this.getAgentPerformanceDetails();

    setInterval(() => {
      this.getAgentPerformanceDetails();
    }, 300000);
  }

  getAgentPerformanceDetails() {
    console.log(this.agent);

    this.loading = true;
    this.ts.getAgentPerformanceDetails(this.agent).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.pendingTicketsStatusCounts = resp['PendingTicketsStatusCounts'];
        this.pendingTicketsPriorityCounts = resp['PendingTicketsPriorityCounts'];
        this.periodicallyClosedCounts = resp['PeriodicallyClosedCounts'];
        this.ticketRatingCounts = resp['TicketRatingCounts'];
        this.finalRatings = resp['FinalRatings'];
        this.totalTicketRatingCounts = resp['TotalTicketRatingCounts'];

        this.lastUpdatedDateTime = new Date();
      }
    }, error => this.loading = false)
  }


  getMemberImageURL(emailId) {
    if (this.agent.photoFileName !== undefined && this.agent.photoFileName != null && this.agent.photoFileName != '') {
      return environment.apiUrl + '/download/profile-photos/' + this.agent.photoFileName;
    } else {
      return 'https://buckinghamflooring.co.uk/wp-content/uploads/2019/10/user_5-15-512.png';
    }
  }

}
