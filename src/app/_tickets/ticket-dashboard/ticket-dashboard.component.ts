import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { NeededService } from 'src/app/_services/needed.service';
import { TicketService } from 'src/app/_services/ticket.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ticket-dashboard',
  templateUrl: './ticket-dashboard.component.html',
  styleUrls: ['./ticket-dashboard.component.css']
})
export class TicketDashboardComponent implements OnInit {

  constructor(private needed: NeededService, private ts: TicketService, private router: Router,
    private actRoute: ActivatedRoute) {
    this.actRoute.queryParams.subscribe(params => {

      console.log(params);
      if (params['email-ids']) {
        let emailIdsParam: string = params['email-ids'];

        let emailIdsArray: Array<string> = emailIdsParam.split(',');

        this._search_filters.agents = [];

        emailIdsArray.forEach(email => {
          this._selected_agents.add(email);
          this._search_filters.agents.push({ emailId: email, firstName: email });
        });

        this.populateAgentName();
      }

    })
  }

  loading = false;
  _agents = [];
  dashDetails = [];
  _selected_agents: Set<string> = new Set();
  _search_filters = {
    agents: [],
  }

  _agentsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'emailId',
    textField: 'firstName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true,
    enableCheckAll: false
  };

  ngOnInit() {
    this.loadAgentData();
  }

  loadAgentData() {
    this.loading = true;
    this.needed.loadNeeded(['agents_min']).subscribe(res => {
      this.loading = false;
      this._agents = res['agents_min'];
      this.populateAgentName();
    }, error => this.loading = false);
  }

  populateAgentName() {

    let _filter_agents = [];

    this._search_filters.agents.forEach(agent => {
      let _agent = this._agents.find(agnt => agnt.emailId == agent.emailId);
      if (_agent !== undefined)
        agent.firstName = _agent.firstName;
      console.log(agent, _agent);
      _filter_agents.push(agent);
    });

    this._search_filters.agents = _filter_agents;
  }

  clear() {
    this._search_filters = {
      agents: [],
    }
  }

  getMemberImageURL(emailId) {
    let agent: Agent = this._agents.find(agent => agent.emailId == emailId);
    if (agent !== undefined && agent.photoFileName !== undefined && agent.photoFileName != null && agent.photoFileName != '') {
      return environment.apiUrl + '/download/profile-photos/' + agent.photoFileName;
    } else {
      return 'https://buckinghamflooring.co.uk/wp-content/uploads/2019/10/user_5-15-512.png';
    }
  }

  getMemberFullDetail(agentEmailId) {
    return this._agents.find(agent => agent.emailId == agentEmailId);
  }

  onAgentSelect(event: Agent) {
    // console.log(event);
    // this._search_filters.agents.push(event);

    this._selected_agents.add(event.emailId);

    if (this._selected_agents.size > 0)
      this.router.navigateByUrl('/tickets/dashboard?email-ids=' + encodeURI(Array.from(this._selected_agents).join()));
    else
      this.router.navigateByUrl('/tickets/dashboard');
  }

  onAgentDeSelect(event) {
    console.log(event);
    // let index = this._search_filters.agents.findIndex(_agent => _agent.emailId == event.emailId);

    // this._search_filters.agents.splice(index, 1);

    this._selected_agents.delete(event.emailId);

    if (this._selected_agents.size > 0)
      this.router.navigateByUrl('/tickets/dashboard?email-ids=' + encodeURI(Array.from(this._selected_agents).join()));
    else
      this.router.navigateByUrl('/tickets/dashboard');
  }

}
