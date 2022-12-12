import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SalesService } from 'src/app/_services/sales.service';

@Component({
  selector: 'app-view-holidays',
  templateUrl: './view-holidays.component.html',
  styleUrls: ['./view-holidays.component.css']
})
export class ViewHolidaysComponent implements OnInit {

  constructor( private datePipe: DatePipe,private ss: SalesService) { }

  ngOnInit() {
    this.loadHolidays();
  }

  rowData = [];
  _respsResp = [];
  loading =false;
  _search_filters = {
    
    institutes: [],
    id: '',
    subject: '',
    latterpadDateFrom: null,
    latterpadDateTo: null,
    letterpadDateObject: null,
    
  }

  columnDefs = [
    
    {
      headerName: 'Date', field: 'holidayDate', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    
    { headerName: 'Holiday Type', field: 'leaveType', width: 220, sortable: true, filter: true, resizable: true },
    { headerName: 'Reason', field: 'reason', width: 520, sortable: true, filter: true, resizable: true },

  ];


  loadHolidays() {
    this.loading = true;
    this.rowData = [];
    this.ss.loadHolidays().subscribe(res => {

      console.log(res);
      this.loading = false;
      this._respsResp = new Array();
      
      this._respsResp =res['holidays'];

      console.log(this._respsResp);

      this._respsResp.filter(resp => resp.leaveType != null).forEach(resp => {

        console.log('Get Holidays',resp);

        let _rowdata: any = {};

        _rowdata.holidayDate = resp.holidayDate;
        _rowdata.leaveType = resp.leaveType;
        _rowdata.reason = resp.reason;
        this.rowData.push(_rowdata);
      })
    }, error => { this.loading = false; });
  }

}
