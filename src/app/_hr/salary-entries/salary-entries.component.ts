import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/_services/sales.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HrService } from 'src/app/_services/hr.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SalaryEntries } from './SalaryEntries';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-salary-entries',
  templateUrl: './salary-entries.component.html',
  styleUrls: ['./salary-entries.component.css']
})
export class SalaryEntriesComponent implements OnInit {

  constructor(private ss: SalesService, private hr: HrService, private currencyPipe: CurrencyPipe,
    private snackbar: MatSnackBar, private datePipe: DatePipe) { }

  gridApi;
  showFilterScreen = true;
  _search_filters = {
    agents: [],
    salaryMonth: '',
    salaryYear: '',
    status: ''
  }
  _agents = [];
  _selectedAgent = [];
  generating = false;
  _AgentsDropdownSettings: IDropdownSettings = {
    idField: 'employeeId',
    textField: 'firstName',
    itemsShowLimit: 10,
    allowSearchFilter: true
  };
  loading = false;
  rowData = [];
  _ses: Array<SalaryEntries> = [];
  _default_columnDefs = [
    {
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true, width: 40
    },
    {
      headerName: 'Staff ID', field: 'employeeId', sortable: true, filter: true, resizable: true, minWidth: 100, width: 120, cellRenderer: (data) => {
        return `<a target="_blank" href="/hr/salary-details-create?edit=1&sid=${data.data.employeeId}">${data.data.employeeId} <i class='fas fa-edit'></i> </a>`;
      }
    },
    { headerName: 'Staff Name', field: 'employeeName', sortable: true, filter: true, resizable: true, minWidth: 140, width: 200 },
    {
      headerName: 'Total Earnings', field: 'totalEarnings', sortable: true, filter: true, resizable: true, minWidth: 80, width: 100, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Total Deductions', field: 'totalDeductions', sortable: true, filter: true, resizable: true, minWidth: 80, width: 100, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Net Pay', field: 'netPay', sortable: true, filter: true, resizable: true, minWidth: 80, width: 100, cellRenderer: (data) => {
        return this.currencyPipe.transform(data.value, 'INR');
      }
    },
    {
      headerName: 'Salary Date', field: 'salaryCreditedDate', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'MMM dd, yyyy');
      }
    },
    { headerName: 'No Of Leaves/Working days', field: 'leaveWorkingDays', sortable: true, filter: true, resizable: true, minWidth: 140, width: 120 },
    { headerName: 'Salary Month', field: 'salaryMonth', sortable: true, filter: true, resizable: true, minWidth: 140, width: 120 },
    { headerName: 'Salary Year', field: 'salaryYear', sortable: true, filter: true, resizable: true, minWidth: 140, width: 120 },
    {
      headerName: 'Payslip', field: 'filename', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.data.filename != null && data.data.filename != '')
          return `<a target="_blank" href="${environment.apiUrl}/download/payslip/download/${data.data.employeeId}/${data.data.filename}">${data.data.filename} </a>`;
        else
          return "--Not Generated--";
      }
    },
    { headerName: 'Status', field: 'status', sortable: true, filter: true, resizable: true },

    { headerName: 'Designation', field: 'designation', sortable: true, filter: true, resizable: true, minWidth: 140, width: 120 },
    { headerName: 'Date Of Joining', field: 'doj', sortable: true, filter: true, resizable: true, minWidth: 140, width: 200 },

    { headerName: 'BanK Name', field: 'bankName', sortable: true, filter: true, resizable: true },
    { headerName: 'Account No', field: 'accountNumber', sortable: true, filter: true, resizable: true },
    { headerName: 'Mode Of Payment', field: 'modeOfPayment', sortable: true, filter: true, resizable: true },

    { headerName: 'PF Number', field: 'pfNumber', sortable: true, filter: true, resizable: true },
    { headerName: 'ESIC Number', field: 'esicNumber', sortable: true, filter: true, resizable: true },
    { headerName: 'PAN Number', field: 'panNumber', sortable: true, filter: true, resizable: true },
    { headerName: 'UAN Number', field: 'uanNumber', sortable: true, filter: true, resizable: true },

    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'MMM d, yyyy hh:mm a');
      }
    },
    {
      headerName: 'Last Updated Date', field: 'lastupdatedatetime', sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'MMM d, yyyy hh:mm a');
      }
    },
  ];

  columnDefs = [];

  ngOnInit() {
    this.loadNeededDetails();
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['agents']).subscribe(res => {
      console.log(res);
      this._agents = res['Agents'];
    })
  }

  loadSalaryEntries() {
    this.loading = true;
    this.rowData = [];
    this.columnDefs = [];
    this.columnDefs = this._default_columnDefs;

    this._search_filters.agents = this._selectedAgent;
    this.hr.getStaffSalaryEntries(this._search_filters).subscribe(resp => {

      this.loading = false;
      this._ses = new Array();
      this._ses = resp['SalaryEntries'];
      let rowDatasEarnings: Array<any> = resp['rowDatasEarnings'];
      let rowDatasDeductions: Array<any> = resp['rowDatasDeductions'];

      var rowDatasEarningsKeys: Array<any> = [];
      var rowDatasDeductionsKeys: Array<any> = [];

      this._ses.forEach(se => {
        let _se: any = Object.assign({}, se);
        _se.leaveWorkingDays = se.noOfDaysLeave + '/' + se.noOfWorkingDays + ' of working days';
        let _earning = rowDatasEarnings.find(data => data.salaryEntryId == _se.id);
        let _deduction = rowDatasDeductions.find(data => data.salaryEntryId == _se.id);

        rowDatasEarningsKeys = Object.keys(_earning);
        rowDatasDeductionsKeys = Object.keys(_deduction);

        console.log(rowDatasEarningsKeys);
        console.log(rowDatasDeductionsKeys);

        rowDatasEarningsKeys.filter(key => key != 'salaryEntryId').forEach(key => {
          // console.log(key, _earning[key]);
          _se[key] = _earning[key];
        })

        rowDatasDeductionsKeys.filter(key => key != 'salaryEntryId').forEach(key => {
          // console.log(key, _deduction[key]);
          _se[key] = _deduction[key];
        })

        this.rowData.push(_se);
      });

      rowDatasEarningsKeys.filter(key => key != 'salaryEntryId').forEach(key => {
        if (this.columnDefs.find(col => col.headerName == key) === undefined)
          this.columnDefs.push({ headerName: key, field: key, sortable: true, filter: true, resizable: true });
      })

      rowDatasDeductionsKeys.filter(key => key != 'salaryEntryId').forEach(key => {
        if (this.columnDefs.find(col => col.headerName == key) === undefined)
          this.columnDefs.push({ headerName: key, field: key, sortable: true, filter: true, resizable: true });
      })

      console.log(this.rowData);

      // Consolidating data


    }, error => { this.loading = false; })
  }

  sendPayslipsMail() {

    let _salaryEntries: Array<SalaryEntries> = this.gridApi.getSelectedRows();

    if (this.gridApi.getSelectedRows().length == 0) {
      Swal.fire('Select atleast 1 Employee Salary Entries', '', 'info');
      return false;
    }

    let noFileNames = [];
    _salaryEntries.filter(se => se.filename == null || se.filename == '')
      .forEach(se => noFileNames.push(se));

    if (noFileNames.length > 0) {
      Swal.fire('Some Entries doest not generated payslip yet.', 'Generate Payslip First', 'info');
      return false;
    }

    this.snackbar.open('Generating... This will take few seconds...');

    this.generating = true;
    let request = {
      salaryEntries: _salaryEntries
    };

    console.log(request);
    this.hr.sendPayslipsMail(request).subscribe(res => {
      this.generating = false;
      console.log(res);
      if (res['StatusCode'] == '00') {
        Swal.fire('Payslips Sent', '', "success");
      } else {
        Swal.fire('', res['StatusDesc'], "error");
      }
    }, error => { this.generating = false });
  }

  generatePayslips() {

    let _salaryEntries: Array<SalaryEntries> = this.gridApi.getSelectedRows();

    if (this.gridApi.getSelectedRows().length == 0) {
      Swal.fire('Select atleast 1 Employee Salary Entries', '', 'info');
      return false;
    }

    this.snackbar.open('Generating... This will take few seconds...')

    this.generating = true;
    let request = {
      salaryEntries: _salaryEntries
    };

    console.log(request);
    this.hr.generatePayslips(request).subscribe(res => {
      this.generating = false;
      console.log(res);
      if (res['StatusCode'] == '00') {

        Swal.fire(res['SuccessCounts'] + '/' + _salaryEntries.length + ' Payslips Generated', '', "success");
        this.loadSalaryEntries();
      } else {
        Swal.fire('', res['StatusDesc'], "error");
      }
    }, error => { this.generating = false });
  }

  exportSalaryEntries() {
    var params = { fileName: 'Salary Export' };

    this.gridApi.exportDataAsCsv(params);
  }

  exportBankSalaryEntriesReport() {

    var params = {
      fileName: 'Bank Salary Report',
      columnKeys: ['employeeId', 'employeeName', 'designation', 'accountNumber', 'salaryMonth', 'salaryYear', 'netPay', 'salaryCreditedDate']
    };

    console.log(this.gridApi);

    this.gridApi.exportDataAsCsv(params);
  }

  clear() {
    this._search_filters = {
      agents: [],
      salaryMonth: '',
      salaryYear: '',
      status: ''
    }
  }
}
