import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { InstituteService } from 'src/app/_services/institute.service';
import { IAngularMyDpOptions, IMyDefaultMonth } from 'angular-mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { SalesService } from 'src/app/_services/sales.service';

export const MY_CUSTOM_FORMATS = {
  fullPickerInput: 'DD/MM/YYYY',
  parseInput: 'DD/MM/YYYY',
  datePickerInput: 'DD/MM/YYYY',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY'
};

@Component({
  selector: 'app-amc-report',
  templateUrl: './amc-report.component.html',
  styleUrls: ['./amc-report.component.css']
})
export class AmcReportComponent implements OnInit {

  private gridApi;
  private gridColumnApi;


  constructor(private http: HttpClient, private is: InstituteService, private tst: ToastrService,private datePipe: DatePipe,private ss: SalesService) { }
  institue: Array<any> = [];
  selectedinstitute = '';
  selectedproduct = '';
  paymode = '';
  validFromDate = '';
  validToDate = '';
  paidFromDate = '';
  paidToDate = '';
  institute: any = [];
  loading = false;
  amcList = [];
  product = "";
  rowData=[];
  showGrid = false;
  _institutes: Array<Institute> = [];
  _selectedInstitute = [];



  ngOnInit() {
    this.loadInstituteDetails();
    this.report();
  }

  _search_filters = {

    institutes : [],
    products : [],
    serviceType:'AMC',
    fromDate : null,
    toDate : null,
    paymentFromDate:null,
    paymentToDate:null,

    amcValidFromDateObject:null,
    amcValidToDateObject:null,
    amcPaidFromDateObject:null,
    amcPaidToDateObject:null,

};

  instChanged() {
    let obs = this.http.post(environment.apiUrl + 'institute/get-institute-products', { institute: { instituteId: this.selectedinstitute } });
    obs.subscribe(
      data => {
        if (data['StatusCode'] == '00') {
          this.product = data['InstituteProducts'];
        } else
          console.log('Error Loading Product::');
      },
      error => { console.log(error); }
    );
  }

  getDateAsString(date) {
    console.log(date);
    if (date == null || date === undefined || date == '')
      return '';
    else {
      let dd = date['singleDate'];
      return this.formatDate(dd['jsDate']);
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }


  getFromDate(date) {
    console.log(date);
    if (date == null || date === undefined || date == '')
      return null;
    else {
      let dd = date['singleDate'];
      return dd['jsDate'];
    }
  }

  getToDate(date) {
    console.log(date);
    if (date == null || date === undefined || date == '')
      return null;
    else {
      let dd = date['singleDate'];
      let formatted = dd['formatted'];
      let farr = formatted.split('/');
      let fromDate = farr[2] + '-' + farr[1] + '-' + farr[0] + 'T11:59:59';
      return new Date(fromDate);
    }
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
  };

  public defMonth: IMyDefaultMonth = {
    defMonth: ''
  };

  report() {
    console.log("inside Report");
    this.loading = true;
    this.is.getAmcReport(this._search_filters).subscribe(res => {
        this.loading = false;
         console.log(res);
         this.amcList = new Array();
        if (res['StatusCode'] == '00') {
          console.log(res['amcList']);
          this.amcList = res['amcList'];
          if (this.amcList.length == 0){
            this.tst.info('No Records Found');
          }
            else{
              this.amcList.forEach(resp=>{
                console.log(resp);
                let _rowdata: any = {};
                _rowdata.institute_name = resp.institute_name;
                _rowdata.paid_amount = resp.paid_amount;
                _rowdata.payment_date = resp.payment_date;
                _rowdata.mode = resp.mode;
                _rowdata.amc_from_date = resp.amc_from_date;
                _rowdata.amc_to_date = resp.amc_to_date;
                _rowdata.invoice_no = resp.invoice_no;
                _rowdata.invoice_date = resp.invoice_date;
                _rowdata.product_name = resp.name;
                this.rowData.push(_rowdata);
              })
              this.showGrid = true;
            }
        }
      }, error => { this.loading = false; console.log(error) });
  }

  clear() {
    window.location.reload();
  }

_respsResp = [];

  columnDefs = [
    {
      headerName: 'Institute', field: 'institute_name', sortable: true, filter: true, minWidth: 150, width: 250, cellRenderer: (data) => {
        return `<a href="/institute/institute-detail?iid=${data.data.instituteId}" target="_blank"> ${data.value} </a>`;
      }
    },
    {
      headerName: 'Invoice No', field: 'invoice_no', sortable: true, filter: true, minWidth: 120, width: 150
    },
    {
      headerName: 'Invoice Date', field: 'invoice_date', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    {
      headerName: 'Paid Amount', field: 'paid_amount', sortable: true, filter: true, minWidth: 110, width: 120
    },
    {
      headerName: 'Paid Date', field: 'payment_date', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    {
      headerName: 'Validity From Date', field: 'amc_from_date', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    {
      headerName: 'Validity To Date', field: 'amc_to_date', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    {
      headerName: 'Pay Mode', field: 'mode', sortable: true, filter: true, minWidth: 120, width: 150
    },
    {
      headerName: 'Product', field: 'product_name', sortable: true, filter: true, minWidth: 120, width: 150
    },
    
  ];



  onGridSelectionChanged() {
    var selectedRows = this.gridApi.getSelectedRows();
    // console.log(selectedRows);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onBtnExport() {
    var params = { fileName: 'Amc Report Export' };
    this.gridApi.exportDataAsCsv(params);
  }

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };


  loadInstituteDetails() {
    this.ss.getSalesNeededData(['institutes']).subscribe(res => {
      this._institutes = res['Institutes'];
      if (this._selectedInstitute.length > 0) {
        this._institutes
          .filter(inst => inst.instituteId == this._selectedInstitute[0].instituteId)
          .forEach(inst => {
            this._selectedInstitute = [];
            this._selectedInstitute.push(inst);

            console.log('Institute Id::::::', inst.instituteId);
          });
      };
    })
  }

  onSelectInstitute(inst) {
    // this.ts.getCallreport(inst.instituteId).subscribe(res => {
     //   console.log(res);
       
     // })
 
   }
 

}
