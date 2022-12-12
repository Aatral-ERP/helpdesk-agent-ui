import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
import { AgentService } from 'src/app/_services/agent.service';
import { NeededService } from 'src/app/_services/needed.service';
import { Attendance } from '../Attendance';
import { WorkingDay } from '../view-working-days/WokingDay';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent implements OnInit {

  constructor(private as: AgentService, private datePipe: DatePipe, private needed: NeededService) { }

  showGrid = true;
  loading = false;
  dates = new Date();

  WorkingDays: Array<WorkingDay> = [];
  attendances: Array<Attendance> = [];
  agents: Array<Agent> = [];

  gridRowData = [];
  columnDefs = [];
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true
  };
  gridApi;
  _agents: Array<Agent> = [];
  agents_selected: Array<Agent> = [];

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
  };

  _AgentsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'employeeId',
    textField: 'firstName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  ngOnInit() {
    this.needed.loadNeeded(['agents_min']).subscribe(resp => {
      this._agents = resp['agents_min'];
    })
  }

  getAttendance() {
    this.WorkingDays = []; this.attendances = []; this.agents = []; this.columnDefs = []; this.gridRowData = [];
    this.showGrid = false;
    let fromDate = new Date(this.dates['dateRange']['beginJsDate']);
    let toDate = new Date(this.dates['dateRange']['endJsDate']);
    this.loading = true;
    this.as.getAttendance(fromDate, toDate, this.agents_selected).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        this.attendances = res['Attendances'];
        this.WorkingDays = res['WorkingDays'];
        this.agents = res['Agents'];

        let column = {
          field: 'employeeId', headerName: 'Staff', pinned: 'left', cellRenderer: (data) => {
            return this.agents.find(agent => agent.employeeId == data.value).firstName;
          }
        };
        this.columnDefs.push(column);

        this.WorkingDays.forEach(wd => {
          let col = {
            field: wd.workingDate,
            width: 120,
            headerName: this.datePipe.transform(wd.workingDate, 'dd/MM/yyyy'),
            cellRenderer: (data) => {
              console.log(data.value);
              return data.value;
            }
          }
          this.columnDefs.push(col);
        })

        this.agents.forEach(agent => {
          this.gridRowData.push(this.getAgentRow(agent));
        })

        this.showGrid = true;
      }
    }, error => this.loading = false)
  }

  getAgentRow(agent) {

    let row: any = {};

    let _attendances_day = this.attendances.filter(att => att.employeeId == agent.employeeId);
    console.log(agent, _attendances_day);

    this.columnDefs.forEach(col => {
      let attandance: Attendance = Array.from(_attendances_day.filter(att => col.field == att.workingDate))[0];
      console.log(col, attandance);
      if (attandance != null && attandance !== undefined) {
        if (attandance.workingStatus == 'W')
          row[col.field + ''] = `<a href='https://www.google.com/maps?q=${attandance.geoCoordinates}'
         target='_blank'>${attandance.workingStatus} (${attandance.startTime})
          &nbsp;<i class='fas fa-external-link-alt'></i>
        </a>`;
        else
          row[col.field + ''] = attandance.workingStatus;
      } else
        row[col.field + ''] = null;
    });

    row['employeeId'] = agent.employeeId;

    return row;
  }

  onBtnExport() {
    var params = { fileName: 'Attendance Export' };
    this.gridApi.exportDataAsCsv(params);
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

}
