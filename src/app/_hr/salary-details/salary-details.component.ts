import { CurrencyPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HrService } from 'src/app/_services/hr.service';
import { SalesService } from 'src/app/_services/sales.service';
import { SalaryDetails } from './SalaryDetails';
import Swal from 'sweetalert2';
import { IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
declare var $: any;

@Component({
  selector: 'app-salary-details',
  templateUrl: './salary-details.component.html',
  styleUrls: ['./salary-details.component.css']
})
export class SalaryDetailsComponent implements OnInit {
  StaffDetails: any[];

  constructor(private ss: SalesService, private hr: HrService, private currencyPipe: CurrencyPipe) { }
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  salaryMonth: string = this.months[new Date().getMonth()];
  salaryYear: string = new Date().getFullYear().toString();
  salaryCreditedDate = new Date();
  salaryCreditedDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
  isSalaryCredited = true;

  loading = false;
  generating = false;
  rowData = [];
  _sd: Array<SalaryDetails> = [];
  columnDefs = [
    {
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true, headerName: '', field: 'id', width: 40
    },
    {
      headerName: 'Staff ID', field: 'sd.employeeId', sortable: true, filter: true, resizable: true, minWidth: 100, width: 120, cellRenderer: (data) => {
        return `<a target="_blank" href="/hr/salary-details-create?edit=1&sid=${data.data.sd.employeeId}">${data.data.sd.employeeId} <i class='fas fa-edit'></i> </a>`;
      }
    }, {
      headerName: 'Total Earnings', field: 'sd.totalEarnings', sortable: true, filter: true, resizable: true, minWidth: 80, width: 100, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Total Deductions', field: 'sd.totalDeductions', sortable: true, filter: true, resizable: true, minWidth: 80, width: 100, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Net Pay', field: 'sd.netPay', sortable: true, filter: true, resizable: true, minWidth: 80, width: 100, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    { headerName: 'BanK Name', field: 'sd.bankName', sortable: true, filter: true, resizable: true, minWidth: 140, width: 200 },
    { headerName: 'Account No', field: 'sd.accountNumber', sortable: true, filter: true, resizable: true, minWidth: 120, width: 160 },
    { headerName: 'IFSC Code', field: 'sd.ifscCode', sortable: true, filter: true, resizable: true, minWidth: 120, width: 160 },
    { headerName: 'Casual Leave', field: 'sd.casualLeave', sortable: true, filter: true, resizable: true, minWidth: 120, width: 160 },
    {
      headerName: 'LOP/day', field: 'sd.lopPerDay', sortable: true, filter: true, resizable: true, minWidth: 120, width: 160, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    { headerName: 'ESIC Number', field: 'sd.esicNumber', sortable: true, filter: true, resizable: true, minWidth: 120, width: 160 },
    { headerName: 'PAN Number', field: 'sd.panNumber', sortable: true, filter: true, resizable: true, minWidth: 120, width: 160 },
    { headerName: 'PF Number', field: 'sd.pfNumber', sortable: true, filter: true, resizable: true, minWidth: 120, width: 160 },
    { headerName: 'UAN Number', field: 'sd.uanNumber', sortable: true, filter: true, resizable: true, minWidth: 120, width: 160 },
    { headerName: 'Mode Of Payment', field: 'sd.modeOfPayment', sortable: true, filter: true, resizable: true, minWidth: 120, width: 160 }
  ];

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  gridApi;

  onGridReady(params) {
    this.gridApi = params.api;
  }

  ngOnInit() {
    this.loadStaffDetails();
  }

  loadStaffDetails() {
    this.loading = true;
    this.rowData = [];
    this.hr.loadStaffDetails().subscribe(res => {
      this.loading = false;
      console.log(res);
      this.StaffDetails = new Array();
      this.StaffDetails = res['salaryDetails'];

      this.StaffDetails.sort((a, b) => b.id - a.id);

      this.StaffDetails.forEach(sd => {
        let _rowData: any = {};
        _rowData.sd = sd.salaryDetail;
        _rowData.agent = sd.agent;

        this.rowData.push(_rowData);
      })

    }, error => { this.loading = false; })
  }

  openSalaryEntryGenerateModal() {

    if (this.gridApi.getSelectedRows().length == 0) {
      Swal.fire('Select atleast 1 Employee Salary Detail', '', "info");
      return false;
    }
    $(function () {
      $('#salarymonthyearmodal').appendTo("body").modal('show');
    });
  }

  generateSalaryEntries() {
    let _salaryDetails: Array<SalaryDetails> = [];

    if (this.gridApi.getSelectedRows().length == 0) {
      Swal.fire('Select atleast 1 Employee Salary Detail', '', "info");
      return false;
    }
    if (this.salaryMonth == '') {
      Swal.fire('Select Month', '', "info");
      return false;
    }
    if (this.salaryYear == '') {
      Swal.fire('Select Year', '', "info");
      return false;
    }

    let _rows = this.gridApi.getSelectedRows();
    console.log(_rows);
    _rows.forEach(sd => {
      _salaryDetails.push(sd['sd']);
    });

    $(function () {
      $('#salarymonthyearmodal').appendTo("body").modal('hide');
    });
    this.generating = true;
    let request = {
      salaryDetails: _salaryDetails, isSalaryCredited: this.isSalaryCredited,
      salaryMonth: this.salaryMonth, salaryYear: this.salaryYear,
      salaryCreditedDate: this.salaryCreditedDate
    };

    console.log(request);
    this.hr.generateSalaryEntries(request).subscribe(res => {
      this.generating = false;
      console.log(res);
      if (res['StatusCode'] == '00') {
        let totalCount = +this.gridApi.getSelectedRows().length;

        Swal.fire(res['GeneratedSalaryEntriesCount'] + '/' + totalCount + ' Salary Entries Generated', '', "success");

      } else {
        Swal.fire('', res['StatusDesc'], "error");
      }
    }, error => { this.generating = false });

  }


}
