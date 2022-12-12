import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { AgentService } from 'src/app/_services/agent.service';
import Swal from 'sweetalert2';
import { AddWorkingDay } from './AddWorkingDay';
import { Module } from 'ag-grid-community';
import { WorkingDay } from '../view-working-days/WokingDay';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-generate-working-days',
  templateUrl: './generate-working-days.component.html',
  styleUrls: ['./generate-working-days.component.css']
})
export class GenerateWorkingDaysComponent implements OnInit {

  constructor(private as: AgentService, private datePipe: DatePipe) { }

  public modules: Module[] = [];
  columnDefs = [
    {
      headerName: 'Working Date',
      field: 'workingDate',
      minWidth: 180,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy')
      }
    },
    {
      field: 'workingDate', headerName: 'Weekday',
      cellRenderer: (data) => {
        return new Date(data.value).toLocaleString('en-us', { weekday: 'long' })
      }
    },
  ];
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };;
  rowSelection = 'multiple';
  gridApi;
  dates = new Date();
  excludeSunday = true;
  excludeSaturday = false;

  WorkingDays: Array<WorkingDay> = [];
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
  };

  ngOnInit() { }

  addWorkingDays() {
    if (this.dates === undefined || this.dates === null) {
      Swal.fire('Choose valid Dates', '', "warning");
      return false;
    }
    this.WorkingDays = [];
    let fromDate = new Date(this.dates['dateRange']['beginJsDate']);
    let toDate = new Date(this.dates['dateRange']['endJsDate']);
    let datesBetween = this.getDates(fromDate, toDate);

    datesBetween.forEach(date => {

      let weekday = new Date(date).toLocaleString('en-us', { weekday: 'long' });
      let add = true;
      if (weekday == 'Sunday' && this.excludeSunday) {
        add = false;
      } else if (weekday == 'Saturday' && this.excludeSaturday) {
        add = false;
      }

      if (add) {
        let _workingDate = new WorkingDay();
        _workingDate.workingDate = date;
        this.WorkingDays.push(_workingDate);
      }
    })
  }


  getDates(startDate, stopDate) {
    var dateArray = new Array();

    while (startDate <= stopDate) {
      dateArray.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    return dateArray;
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  selectedRows() {
    console.log(this.gridApi.getSelectedRows());

    if (this.gridApi.getSelectedRows().length == 0) {
      Swal.fire('Select atleast 1 Working Date', '', "info");
    }

    this.as.addWorkingDates(this.gridApi.getSelectedRows()).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        let failedCount = +res['failedCount'];
        let totalCount = +this.gridApi.getSelectedRows().length;
        let successCount = totalCount - failedCount;

        Swal.fire(successCount + '/' + totalCount + ' working days added', res['StatusDesc'], "success");
        this.WorkingDays = [];
        this.dates = null;

      } else {
        Swal.fire('', res['StatusDesc'], "error");
      }
    })
  }

}
