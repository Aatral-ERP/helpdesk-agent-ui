import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { WorkingDay } from '../view-working-days/WokingDay';
import { AgentService } from 'src/app/_services/agent.service';
import Swal from 'sweetalert2';
import { Attendance } from '../Attendance';
import { DatePipe } from '@angular/common';
import { RichSelectModule } from '@ag-grid-enterprise/rich-select';
import { Agent } from 'src/app/_profile/agent-profile/Agent';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent implements OnInit {

  constructor(private as: AgentService, private datePipe: DatePipe) { }
  showGrid = true;
  loading = false;
  dates = new Date();
  WorkingDays: Array<WorkingDay> = [];
  attendances: Array<Attendance> = [];
  agents: Array<Agent> = [];
  changedAttendances: any = {};
  public modules = [
    RichSelectModule
  ];
  gridRowData = [];
  columnDefs = [];
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true
  };
  rowSelection = 'multiple';
  gridApi;
  ngOnInit() {
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
  };

  onGridReady(params) {
    this.gridApi = params.api;
  }

  getAttendance() {
    this.WorkingDays = []; this.attendances = []; this.agents = [];
    this.showGrid = false;
    this.changedAttendances = {};
    let fromDate = new Date(this.dates['dateRange']['beginJsDate']);
    let toDate = new Date(this.dates['dateRange']['endJsDate']);
    this.loading = true;
    this.as.getAttendance(fromDate, toDate).subscribe(res => {
      this.loading = false;
      console.log(res);
      this.WorkingDays = res['WorkingDays'];
      this.attendances = res['Attendances'];
      this.agents = res['Agents'];
      if (this.attendances.length == 0) {
        Swal.fire('', 'No Attendance Found', "info");
      } else {
        this.prepareAttendanceGrid();
      }
    }, error => this.loading = false)
  }

  prepareAttendanceGrid() {
    this.columnDefs = [];
    this.gridRowData = [];
    let column = {
      field: 'employeeId', headerName: 'Staff', pinned: 'left', cellRenderer: (data) => {
        return this.agents.find(agent => agent.employeeId == data.value).firstName;
      }
    };
    this.columnDefs.push(column);

    this.WorkingDays.forEach(wd => {
      let col = {
        field: wd.workingDate,
        headerName: this.datePipe.transform(wd.workingDate, 'dd/MM/yyyy'),
        editable: true,
        cellEditorSelector:
          function (params) {
            if (params.value == null) {
              return { component: 'agRichSelect' };
            }
            return {
              component: 'agRichSelect',
              params: { values: ['W', 'L', 'OD', 'NONE'] }
            };
          },
        minWidth: 100
      }
      this.columnDefs.push(col);
    })

    this.agents.forEach(agent => {
      this.gridRowData.push(this.getAgentRow(agent));
    })

    console.log(this.columnDefs);
    console.log(this.gridRowData);
    this.showGrid = true;
  }

  getAgentRow(agent) {

    let row: any = {};

    let _attendances_day = this.attendances.filter(att => att.employeeId == agent.employeeId);
    console.log(agent, _attendances_day);

    this.columnDefs.forEach(col => {
      let attandance: Attendance = Array.from(_attendances_day.filter(att => col.field == att.workingDate))[0];
      console.log(col, attandance);
      if (attandance != null && attandance !== undefined)
        row[col.field + ''] = attandance.workingStatus;
      else
        row[col.field + ''] = null;
    });

    row['employeeId'] = agent.employeeId;
    return row;
  }

  onCellValueChanged(event) {
    console.log(event);
    let _c_att: Attendance;
    if (event.type == "cellValueChanged") {
      let data = event.data;
      let _col_def = event.colDef;
      _c_att = new Attendance();
      _c_att.employeeId = data.employeeId;
      _c_att.workingDate = _col_def.field;
      let _old_att = this.findOldAttendanceFromMaster(_c_att);
      _c_att = _old_att;
      _c_att.workingStatus = event.newValue;
      if (_c_att.startTime != null && _c_att.workingStatus == 'NONE') {
        _c_att.startTime = null;
      }
    }

    if (_c_att !== undefined) {
      this.changedAttendances[_c_att.id] = _c_att;
    }
    console.log(this.changedAttendances);
  }

  findOldAttendanceFromMaster(oldAttendance): Attendance {
    console.log(oldAttendance);
    let _old_att: Attendance;

    this.attendances
      .filter(attds => attds.workingDate == oldAttendance.workingDate)
      .forEach(att => {
        if (att.employeeId == oldAttendance.employeeId) {
          _old_att = att;
        }
      })

    return _old_att;
  }

  UpdateChangedAttendances() {
    const values: Array<Attendance> = Object.keys(this.changedAttendances).map(key => this.changedAttendances[key]);
    if (values.length == 0) {
      Swal.fire('Change Atleast one attendance', '', 'info');
      return false;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to update the Attendance.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Close it!'
    }).then((result) => {
      if (result.value) {
        this.as.saveAllAttendance(values).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire(res['StatusDesc'], '', 'success');
            this.getAttendance();
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

}
