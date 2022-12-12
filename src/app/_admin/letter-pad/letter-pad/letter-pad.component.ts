import { Component, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/_services/auth.service';
import { TicketService } from 'src/app/_services/ticket.service';
import { environment } from 'src/environments/environment';
import { Letterpad } from './Letterpad';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { SalesService } from 'src/app/_services/sales.service';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-letter-pad',
  templateUrl: './letter-pad.component.html',
  styleUrls: ['./letter-pad.component.css']
})
export class LetterPadComponent implements OnInit {

  letterpad: Letterpad = new Letterpad();
  letterpadAll: Array<Letterpad> = [];

  id ='';
  toAddress = '';
  content='';
  subject='';
  regardText='';
  letterPadDate='';
  fileName='';
  fileSize='';
  fileType='';
  showViewDiv = true;
  showAddNewDiv = false;
  addRoundSeal = true;
  addFullSeal = true;
  addSign = true;
  signatureBy ='';
  designation = this.auth.getLoginAgentDesignation();
  loading = false;
  saving = false;
  receiptContent = "";
  showReceiptTemplate = false;
  receiptTemplate = "";
  generatingCallReportPDF=false;
  generatingPDF = false;


  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };

 
  constructor(private route: Router, private snackbar: MatSnackBar, private ts: TicketService,
    private actRoute: ActivatedRoute, private auth: AuthService, private datePipe: DatePipe,private ss: SalesService) { }


    
  ngOnInit() {
    this.loadInstituteDetails();
    this.loadLetterpad();
  }

  onSelectInstitute(inst) {
   // this.ts.getCallreport(inst.instituteId).subscribe(res => {
    //   console.log(res);
      
    // })

  }

  _respsResp = [];
  rowData = [];
  showFilterScreen = true;
  showQuoteFilterScreen = false;
  //_institutes = [];
  _institutes: Array<Institute> = [];
  _selectedInstitute = [];
  

  columnDefs = [
    {
      headerName: 'Letterpad No', field: 'id', width: 120, cellRenderer: (data) => {
        return `<a href="/sales/letterpad/create-letterpad?edit=${data.data.id}" target="_blank"> <i class='fas fa-edit'></i>${data.data.id} </a>`;
      }
    },
    // {
    //   headerName: 'Institute', field: 'institutename', sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value }, cellRenderer: (data) => {
    //     return `<a href="/institute/institute-detail?iid=${data.data.letterpad.institute.instituteId}" target="_blank"> ${data.value} </a>`;
    //   }
    // },
    { headerName: 'Institute', field: 'institutename',width: 400, sortable: true, filter: true, resizable: true, tooltip: (data) => { return data.value } },
    { headerName: 'Subject', field: 'subject', width: 150, sortable: true, filter: true, resizable: true },
    
    {
      headerName: 'Date', field: 'date', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'dd/MM/yyyy');
      }
    },
    { headerName: 'File', field: 'filename', width: 120, sortable: true, filter: true, resizable: true },

  ];


 
  

  saveLetterpad()
{
this.ts.saveLetterpad(this.letterpad).subscribe(res=>{

  if(res['StatusCode']=='00')
  {
    this.snackbar.open('Saved Successfully');
    this.letterpad = res['letterpad'];
    window.location.href = "./reports/letterpad";

  }
},error=>{

})
}

  clear() {
    window.location.href = "./reports/reports/letterpad";
  }

  deleteLetterpad(id) {
    this.ts.deleteLetterpad(id).subscribe(res => {
      if (res['StatusCode'] == '00') {
              this.snackbar.open('Deleted');
              window.location.href = "./reports/letterpad";
      }
    },
    error=>{
      

    })
  }

  

  viewPDF(id,fileName) {
    let url = environment.apiUrl + 'download/download-lettepad-pdf/view/' + id+ '/' + fileName;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }
  
  downloadPDF(id,fileName) {
    let url = environment.apiUrl + 'download/download-lettepad-pdf/download/' + id + '/' + fileName;
    window.open(url, '_blank');
  }

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'instituteId',
    textField: 'instituteName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  dateChanged(event) {
    console.log(event);
  }

  _search_filters = {
    
    institutes: [],
    id: '',
    subject: '',
    latterpadDateFrom: null,
    latterpadDateTo: null,
    letterpadDateObject: null,
    
  }

  loadInstituteDetails() {
    this.ss.getSalesNeededData(['institutes']).subscribe(res => {
      this._institutes = res['Institutes'];
      if (this._selectedInstitute.length > 0) {
        this._institutes
          .filter(inst => inst.instituteId == this._selectedInstitute[0].instituteId)
          .forEach(inst => {
            this.letterpad.institute = inst;
            this._selectedInstitute = [];
            this._selectedInstitute.push(inst);

            console.log('Institute Id::::::', inst.instituteId);
          });
      };
    })
  }


  clearFilters() {
    this._search_filters = {
      institutes: [],
      id: '',
      subject: '',
      latterpadDateFrom: null,
      latterpadDateTo: null,
      letterpadDateObject: null,
    }
  }

  loadLetterpad() {
    this.loading = true;
    this.rowData = [];
    this.ss.loadDealLetterpadReport(this._search_filters).subscribe(res => {
      this.loading = false;
      this._respsResp = new Array();
      
      this._respsResp =res['letterpadData'];

      console.log(this._respsResp);

      this._respsResp.filter(resp => resp.SUBJECT != null).forEach(resp => {

        console.log('Get All Letterpad',resp);

        let _rowdata: any = {};

        _rowdata.institutename = resp.institute_name;
        _rowdata.instituteid = resp.institute_id;        
        _rowdata.subject = resp.SUBJECT;
        _rowdata.content = resp.content;
        _rowdata.date = resp.DATE;
        _rowdata.filename = resp.file_name;
        _rowdata.id = resp.id;
        this.rowData.push(_rowdata);
      })
    }, error => { this.loading = false; });
  }

 
 


}
