import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AgentService } from '../../_services/agent.service';
import { DatePipe } from '@angular/common';
import { Agent } from 'src/app/_profile/agent-profile/Agent';

@Component({
  selector: 'app-view-agents',
  templateUrl: './view-agents.component.html',
  styleUrls: ['./view-agents.component.css']
})
export class ViewAgentsComponent implements OnInit {

  constructor(private as: AgentService, private datePipe: DatePipe) { }
  company = '';
  loading = false;
  agents: Array<Agent> = [];

  gridApi: any;
  columnDefs = [
    {
      headerName: '', field: 'employeeId', width: 40, cellRenderer: (data) => {
        return `<a href='/hr/agent/agent-register?edit=1&aid=${data.data.employeeId}' target='_blank'><i class='fas fa-edit'></i> </a>`;
      }
    },
    { headerName: 'Employee Id', field: 'employeeId', width: 120, sortable: true, filter: true, resizable: true },
    {
      headerName: 'Name', field: 'firstName', sortable: true, filter: true, resizable: true,
      tooltip: (data) => { return data.value + ' ' + data.data.lastName }
    },
    { headerName: 'Designation', field: 'designation', sortable: true, filter: true, resizable: true },
    { headerName: 'Category', field: 'category', sortable: true, filter: true, resizable: true },
    { headerName: 'Role', field: 'roleName', sortable: true, filter: true, resizable: true },
    { headerName: 'Email Id', field: 'emailId', sortable: true, filter: true, resizable: true },
    { headerName: 'Phone', field: 'phone', width: 120, sortable: true, filter: true, resizable: true },
    {
      headerName: 'Previous Experience', field: 'experienceYear', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return data.data.experienceYear + ' year(s) ' + data.data.experienceMonth + ' months';
      }
    },
    {
      headerName: 'DOJ', field: 'dateOfJoining', width: 100, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    { headerName: 'Gender', field: 'gender', width: 100, sortable: true, filter: true, resizable: true },
    { headerName: 'Full Address', field: 'fullAddress', sortable: true, filter: true, resizable: true },
    {
      headerName: 'Login Access/Blocked', field: 'isBlocked', width: 120, sortable: true, resizable: true, cellRenderer: (data) => {
        if (!data.value)
          return '<span class="text-success">Login Access</span>';
        else
          return '<span class="text-danger">Blocked</span>';
      }
    }, {
      headerName: 'Working Status', field: 'workingStatus', width: 120, sortable: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'working')
          return `<span class="text-success">${data.value}</span>`;
        else
          return `<span class="text-muted">${data.value}</span>`;
      }
    }
  ];

  ngOnInit() {
    this.getAgents();
  }

  getAgents() {
    this.loading = true;
    this.as.getAllAgent(this.company).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00')
        this.agents = res['Agents'];
      else
        Swal.fire('', res['StatusDesc'], 'warning');
    }, error => this.loading = false)
  }

}
