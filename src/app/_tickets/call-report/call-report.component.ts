import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketService } from 'src/app/_services/ticket.service';
import { InstituteService } from 'src/app/_services/institute.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Deal } from 'src/app/_sales/_entity/deals-create/Deal';
import { SalesService } from 'src/app/_services/sales.service';
import { CallReport } from './CallReport';
import { AuthService } from 'src/app/_services/auth.service';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

declare var $: any;
@Component({
  selector: 'app-call-report',
  templateUrl: './call-report.component.html',
  styleUrls: ['./call-report.component.css']
})
export class CallReportComponent implements OnInit {

  callReport: CallReport = new CallReport();
  callReportAll: Array<CallReport> = [];
  loading = true;
  saving = false;
  showAddNewDiv = false;
  addRoundSeal = true;
  addFullSeal = true;
  addSign = true;
  signatureBy ='';
  designation = this.auth.getLoginAgentDesignation();
  generatingPDF = false;
  institute = [];
  instName = '';
  gstPercent = 18;
  showAddNewEmail = false;

  showViewDiv = true;

  receiptContent = "";
  showReceiptTemplate = false;
  receiptTemplate = "";
  generatingCallReportPDF=false;

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };


  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };


  constructor(private route: Router, private snackbar: MatSnackBar, private ts: TicketService, private is: InstituteService,
    private actRoute: ActivatedRoute, private ss: SalesService, private auth: AuthService) { }

  _mode = 'Create';

  deal: Deal = new Deal();
  _institutes = [];
  _selectedInstitute = [];

  _inst_contacts = [];

  productName = '';
  _is_products_loading = false;
  _products = [];
  _productsShow = [];

  ngOnInit() {
    this.loadInstituteDetails();

  }

  loadInstituteDetails() {
    this.ss.getSalesNeededData(['institutes', 'products']).subscribe(res => {
      this._institutes = res['Institutes'];
      this._products = res['Products'];

      if (this._selectedInstitute.length > 0) {
        this._institutes
          .filter(inst => inst.instituteId == this._selectedInstitute[0].instituteId)
          .forEach(inst => {
            this.deal.institute = inst;
            this._selectedInstitute = [];
            this._selectedInstitute.push(inst);

            console.log('Institute Id::::::', inst.instituteId);
          });
      };
    })
  }


  saveCallReport() {
    if (this._selectedInstitute.length > 0) {
      this._institutes
        .filter(inst => inst.instituteId == this._selectedInstitute[0].instituteId)
        .forEach(inst => {
          this.deal.institute = inst;
          this._selectedInstitute = [];
          this._selectedInstitute.push(inst);

          console.log('Institute Id::::::', inst.instituteId);
          this.callReport.instituteId = inst.instituteId;
          console.log(this.callReport.instituteId);
          this.ts.saveCallReport(this.callReport).subscribe(res => {
            console.log(res);
            if (res['StatusCode'] == '00') {
              this.snackbar.open('Saved Successfully');
              this.callReport = res['callReport'];
            }

          }, error => {

          })
        });
    };
  }

  clear() {
    window.location.href = "./reports/call-report";
  }

  // viewPDF() {
  //   this.ts.viewPDF(this.callReport.id, this.callReport.receiptfilename);
  // }
  deleteCallReport(id) {
    this.ts.deleteCallReport(id).subscribe(res => {
      if (res['StatusCode'] == '00') {
              this.snackbar.open('Deleted');
      }
    })
  }

  generateCallReport(callReportAll) {
    this.generatingPDF = true;
    this.ts.generateCallReport(callReportAll.id, this.addSign,this.addRoundSeal,this.addFullSeal).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this.generatingPDF =false;
        this.snackbar.open('Uploaded Successfully', 'OK');
      }
    })
  }

  onSelectInstitute(inst) {
    this.ts.getCallreport(inst.instituteId).subscribe(res => {
      console.log(res);
      this.callReportAll = res['callReport'];
    })

  }

  onSelect(inst) {
    this.callReport.instituteId = inst.instituteId;

  }
  callReportFileUploadChange(id,file: File) {
  console.log(id);

  if (file.type.toLowerCase() != 'application/pdf') {
    this.snackbar.open('Only PDF file type is valid');
    return false;
  }

  Swal.fire({
    title: 'Are you sure?',
    text: "You want to Upload.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, Upload!'
  }).then((result) => {
    if (result.value) {
      this.generatingCallReportPDF = true;
      this.ts.UploadGeneratedCallReportPDF(id,file).subscribe(res => {

        this.generatingCallReportPDF = false;
        if (res['StatusCode'] == '00') {
          this.callReport.fileName = res['CallReport']['fileName'];
          this.callReport.instituteId = res['CallReport']['instituteId'];
          this.snackbar.open('Uploaded Successfully', 'OK');
          this.viewPDF(this.callReport.instituteId,this.callReport.fileName);
        } else {
          this.snackbar.open('Something went wrong! Try again later', 'OK');
        }
      })
    }
  })
}

viewPDF(instituteId,fileName) {
  let url = environment.apiUrl + 'download/download-call-report-pdf/view/' + instituteId+ '/' + fileName;
  window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
}

downloadPDF(instituteId,fileName) {
  let url = environment.apiUrl + 'download/download-call-report-pdf/download/' + instituteId + '/' + fileName;
  window.open(url, '_blank');
}
}
