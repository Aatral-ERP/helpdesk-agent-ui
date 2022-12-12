import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import { forkJoin } from 'rxjs';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { LeaveManagementService } from 'src/app/_services/leave-management.service';
import { NeededService } from 'src/app/_services/needed.service';
import { LeaveBalance } from './LeaveBalance';

@Component({
  selector: 'app-leave-balances-sheet',
  templateUrl: './leave-balances-sheet.component.html',
  styleUrls: ['./leave-balances-sheet.component.css']
})
export class LeaveBalancesSheetComponent implements OnInit {

  constructor(private lms: LeaveManagementService, private needed: NeededService,
    private snackbar: MatSnackBarModule,
    private datePipe: DatePipe) { }

  agents: Array<Agent> = [];
  balances: Array<LeaveBalance> = [];
  private gridApi;
  loading = false;

  defaultColDef = { resizable: true, sortable: true };

  columnDefs = [
    { headerName: 'Staff Name', field: 'staffName', filter: true, minWidth: 150, width: 250 },
    { headerName: 'Email id', field: 'emailId', filter: true, minWidth: 150, width: 250 },
    { headerName: 'Annual Leave', field: 'annualLeave', filter: 'agNumberColumnFilter', width: 120 },
    { headerName: 'Casual Leave', field: 'casualLeave', filter: 'agNumberColumnFilter', width: 120 },
    { headerName: 'Sick Leave', field: 'sickLeave', filter: 'agNumberColumnFilter', width: 120 },
    { headerName: 'Other Leave', field: 'otherLeave', filter: 'agNumberColumnFilter', width: 120 },
    { headerName: 'Permissions', field: 'permissions', filter: 'agNumberColumnFilter', width: 120 },
    {
      headerName: 'Last Modified Date', field: 'lastupdatedatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    }
  ];

  onGridReady(params) {
    this.gridApi = params.api;
  }


  ngOnInit() {
    this.getAllLeaveBalance();
  }

  getAllLeaveBalance() {
    this.loading = true;
    forkJoin([this.lms.getAllLeaveBalance(), this.needed.loadNeeded(['agents_min'])]).subscribe(resps => {
      console.log(resps);
      this.loading = false;

      let balanceResp = resps[0];
      let neededResp = resps[1];

      if (balanceResp['StatusCode'] == '00') {
        this.balances = balanceResp['LeaveBalances'];
        if (neededResp['StatusCode'] == '00') {
          this.agents = neededResp['agents_min'];
          this.balances.forEach(balance => {
            let agent = this.agents.find(agent => agent.emailId == balance.emailId);
            if (agent !== undefined)
              balance.staffName = agent.firstName + ' ' + agent.lastName;
          })
        }
      }
    }, error => this.loading = false)
  }

}
