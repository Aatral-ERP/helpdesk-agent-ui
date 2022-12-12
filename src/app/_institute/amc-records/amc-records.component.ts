import { Component, OnInit } from '@angular/core';
import { AgentService } from 'src/app/_services/agent.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { RichSelectModule } from '@ag-grid-enterprise/rich-select';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-amc',
  templateUrl: './amc-records.component.html',
  styleUrls: ['./amc-records.component.css']
})
export class AMCRecordsComponent implements OnInit {

  constructor(private as: AgentService, private tst: ToastrService, private datePipe: DatePipe) { }

  showProgress = false;
  showGrid = false;
  dates = null;

  Institutes: Array<any> = [];
  Products: Array<any> = [];
  ServiceUnders: Array<any> = [];

  _institutes = [];
  _products = [];
  _serviceUnders = [];
  public modules = [
    RichSelectModule
  ];
  instituteProducts: Array<any> = [];

  changedInstituteProducts: any = {};

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
  };
  private gridApi;
  defaultColDef = { resizable: true, sortable: true };

  columnDefs = [
    {
      headerName: 'Institute', field: 'institute.instituteName', filter: true, minWidth: 150, width: 250
    },
    { field: 'product.name', headerName: 'Product', filter: true, minWidth: 150, width: 250 },
    {
      field: 'currentServiceUnder', headerName: 'CurrentServiceUnder', filter: true, minWidth: 100, width: 120,
      editable: true,
      cellEditorSelector:
        function (params) {
          if (params.value == null) {
            return { component: 'agRichSelect' };
          }
          return {
            component: 'agRichSelect',
            params: { values: ["NotInAnyService", "Warranty", "AMC", "ServiceCall"] }
          };
        },
    },
    {
      field: 'amcExpiryDate', headerName: 'Expiry Date', width: 120, editable: true,
    },
    { field: 'lastAMCPaidDate', headerName: 'last AMC PaidDate', width: 150, editable: true },
    {
      field: 'amcAmount', headerName: 'AMC Amount', width: 120, editable: true,
    }, {
      field: 'quantity', headerName: 'Quantity', width: 120, editable: true,
    },
    {
      headerName: 'Create AMC', editable: true, cellRenderer: (data) => {
        return `<a href="/sales/deals/create?prefill-amc-institute=1&iid=${data.data.institute.instituteId}" target="_blank"> Create AMC Quote <i class='fas fa-link'></i> </a>`;
      }
    },
    {
      headerName: 'Reminder DealId', field: 'lastAMCReminderDealId', editable: true, width: 100, cellRenderer: (data) => {
        if (data.value != null)
          return `<a href="/sales/deals/overview/${data.value}" target="_blank"> ${data.value} <i class='fas fa-external-link-alt'></i> </a>`;
        else
          return "";
      }
    },
    {
      field: 'lastAMCReminderSentDateTime', headerName: 'last AMC Reminder Sent On', width: 200, editable: true,
      cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'medium')
      }
    },
    {
      headerName: 'City', field: 'institute.city', filter: true, minWidth: 150, width: 250
    }, {
      headerName: 'State', field: 'institute.state', filter: true, minWidth: 150, width: 250
    }
  ];

  _productsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'instituteId',
    textField: 'instituteName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  _serviceUnderDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  ngOnInit() {
    this.getInstituteProductsAllReportData();
  }

  onGridReady(params) {
    this.gridApi = params.api;
  }


  onCellValueChanged(event) {
    console.log(event);
    if (event.type == "cellValueChanged") {
      let data = event.data;
      data.amcAmount = +data.amcAmount;
      this.changedInstituteProducts[data['id']] = data;
    }
    console.log(this.changedInstituteProducts);
  }

  getInstituteProductsAllReportData() {
    this.as.getInstituteProductsAllReportData().subscribe(res => {
      this.Institutes = res['Institutes'];
      this.Products = res['Products'];
      this.ServiceUnders = res['ServiceUnders'];
    })
  }

  submit() {
    let fromDate = null;
    let toDate = null;
    if (this.dates != null) {
      try {
        console.log(this.dates);
        fromDate = new Date(this.dates['dateRange']['beginJsDate']);
        toDate = new Date(this.dates['dateRange']['endJsDate']);
      } catch (err) {
        console.log(err);
        fromDate = null; toDate = null;
      }
    }

    this.showProgress = true;
    this.instituteProducts = []; this.changedInstituteProducts = [];
    this.as.getInstituteProductsAll(this._institutes, this._products, this._serviceUnders, fromDate, toDate, false).subscribe(res => {
      console.log(res); this.showProgress = false;
      if (res['StatusCode'] == '00') {
        this.instituteProducts = res['InstituteProducts'];
        if (this.instituteProducts.length == 0)
          this.tst.error("No Institute Products Found");
      } else {
        this.tst.error(res['StatusDesc']);
      }
    })
  }

  clear() {
    window.location.href = './institute/amc-records';
  }

  saveChanges() {
    const values: Array<any> = Object.keys(this.changedInstituteProducts).map(key => this.changedInstituteProducts[key]);
    if (values.length == 0) {
      Swal.fire('Change Atleast one Product', '', 'info');
      return false;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to update.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Close it!'
    }).then((result) => {
      if (result.value) {
        this.as.saveInstituteProducts(values).subscribe(res => {
          console.log(res);
          if (res['StatusCode'] == '00') {
            Swal.fire(res['StatusDesc'], '', 'success');
            this.submit();
          } else {
            Swal.fire(res['StatusDesc'], '', 'error');
          }
        })
      }
    })
  }

  sendAMCReminder() {
    let instituteProducts = this.gridApi.getSelectedRows();
    this.as.sendAMCReminder(instituteProducts).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        Swal.fire('', 'Sending Reminders to ' + res['NoOfInstitutes'] + ' institutes', 'success');
      } else {
        Swal.fire(res['StatusDesc'], '', 'error');
      }
    })
  }

}
