import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/_services/sales.service';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';
import { InstituteService } from 'src/app/_services/institute.service';
import { AgentService } from 'src/app/_services/agent.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-amc-reminder',
  templateUrl: './amc-reminder.component.html',
  styleUrls: ['./amc-reminder.component.css']
})
export class AmcReminderComponent implements OnInit {

  constructor(private ss: SalesService, private as: AgentService, private is: InstituteService, private datePipe: DatePipe) {

    // this._search_filters.createdDateFrom = new Date;
    // this._search_filters.createdDateTo = new Date();
    // this._search_filters.createdDateObject = {
    //   isRange: true, singleDate: null, dateRange: {
    //     beginJsDate: new Date(),
    //     endJsDate: new Date()
    //   }
    // };
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  _search_filters = {
    institutes: [],
    createdDateObject: null,
    createdDateFrom: null,
    createdDateTo: null,
  }

  rowData = [];
  _institutes = [];
  logs = [];

  private gridAPI;

  showFilterScreen = false;
  loading = false;
  sendingEmail = false;

  columnDefs = [
    {
      headerName: '', width: 40, cellRenderer: (data) => {
        return `<a href="/sales/deals/overview/${data.data.log.dealId}/deal" target="_blank"> <i class='fas fa-external-link-alt'></i> </a>`;
      }
    },
    {
      headerName: 'Institute', field: 'log.institute.instituteName', sortable: true, filter: true, resizable: true,
      tooltip: (data) => { return data.data.log.institute.instituteName + " - " + data.data.log.institute.city },
      cellRenderer: (data) => {
        return data.data.log.institute.instituteName + " - " + data.data.log.institute.city;
      }
    },
    {
      headerName: 'Deal Created', field: 'log.createDeal', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value === true)
          return `<i class="fas fa-check-circle text-success"></i>`;
        else
          return `<i class="fas  fa-times-circle text-danger"></i>`;
      }
    }, {
      headerName: 'Proforma Invoice Created', field: 'log.createProformaInvoice', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value === true)
          return `<i class="fas fa-check-circle text-success"></i>`;
        else
          return `<i class="fas  fa-times-circle text-danger"></i>`;
      }
    }, {
      headerName: 'PDF Generated', field: 'log.generateProformaInvoice', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value === true)
          return `<i class="fas fa-check-circle text-success"></i>`;
        else
          return `<i class="fas  fa-times-circle text-danger"></i>`;
      }
    }, {
      headerName: 'Sent Email', field: 'log.sendEmail', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value === true)
          return `<i class="fas fa-check-circle text-success"></i>`;
        else
          return `<i class="fas  fa-times-circle text-danger"></i>`;
      }
    },
    { headerName: 'Mail To', field: 'log.mailTo', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Mail CC', field: 'log.mailList', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Filename', field: 'log.invoiceURL', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    {
      headerName: 'Reminder Date', field: 'log.createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    }
  ];

  ngOnInit() {
    this.loadAMCReminders();
    // this.loadNeededDetails();
  }

  onGridReady(params) {
    this.gridAPI = params.api;
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['institutes']).subscribe(res => {
      console.log(res);
      this._institutes = res['Institutes'];
    })
  }

  loadAMCReminders() {
    this.loading = true;
    this.rowData = [];
    this.is.loadAMCReminders(this._search_filters).subscribe(res => {
      this.loading = false;
      this.logs = new Array();
      this.logs = res['Logs'];

      this.logs.forEach(log => {
        let _rowData: any = {};
        _rowData.log = log;
        this.rowData.push(_rowData);
      })
    }, error => { this.loading = false; });
  }

  clearFilters() {
    this._search_filters = {
      institutes: [],
      createdDateObject: null,
      createdDateFrom: null,
      createdDateTo: null,
    }
  }

  resendAMCReminderMail() {
    let log = this.gridAPI.getSelectedRows()[0];
    this.as.resendAMCReminderMail(log).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        Swal.fire('', 'Successfully Send the mail', 'success');
      } else {
        Swal.fire(res['StatusDesc'], '', 'error');
      }
    })
  }

}
