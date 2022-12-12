import { Component, OnInit } from '@angular/core';
import { AgentService } from 'src/app/_services/agent.service';
import { Module } from 'ag-grid-community';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { WorkingDay } from './WokingDay';

@Component({
  selector: 'app-view-working-days',
  templateUrl: './view-working-days.component.html',
  styleUrls: ['./view-working-days.component.css']
})
export class ViewWorkingDaysComponent implements OnInit {

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
    {
      field: 'createddatetime', headerName: 'Generated Date',
      cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy')
      }
    }
  ];
  defaultColDef = {
    flex: 1,
    minWidth: 100,
    resizable: true,
  };
  rowSelection = 'multiple';
  gridApi;
  dates = new Date();
  WorkingDays: Array<WorkingDay> = [];

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
  };

  ngOnInit() {
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  getWorkingDays() {
    this.WorkingDays = [];
    let fromDate = new Date(this.dates['dateRange']['beginJsDate']);
    let toDate = new Date(this.dates['dateRange']['endJsDate']);

    this.as.getWorkingDays(fromDate, toDate).subscribe(res => {
      console.log(res);
      this.WorkingDays = res['WorkingDays'];

      if (this.WorkingDays.length == 0) {
        Swal.fire('', 'No Working Days Found', "info");
      }
    })
  }

  deleteWorkingDates() {
    if (this.gridApi.getSelectedRows().length == 0) {
      Swal.fire('Select atleast 1 Working Date', '', "info");
      return false;
    }

    Swal.fire({
      title: 'Are you sure to delete?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete!',
      cancelButtonText: 'No, Close'
    }).then((result) => {
      if (result.value) {

        this.as.deleteWorkingDates(this.gridApi.getSelectedRows()).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            let totalCount = +this.gridApi.getSelectedRows().length;

            Swal.fire(totalCount + ' working days deleted', res['StatusDesc'], "success");
            this.WorkingDays = [];
            this.dates = null;

          } else {
            Swal.fire('', res['StatusDesc'], "error");
          }
        })

      } else {
        console.log(result);
      }
    })


  }

}
