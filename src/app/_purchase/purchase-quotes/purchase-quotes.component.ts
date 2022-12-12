import { Component, OnInit, Input } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { SalesService } from 'src/app/_services/sales.service';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';
import { DealQuotation } from './DealQuotation';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-quotes',
  templateUrl: './purchase-quotes.component.html',
  styleUrls: ['./purchase-quotes.component.css']
})
export class PurchaseQuotesComponent implements OnInit {
  constructor(private ss: SalesService,private as:AuthService) {
  }
  quoteList = [];
  loading = false;
  rowData = [];
  _respsResp = [];
  _institutes = [];

  generatingQuotationPDF = false;
  addRoundSeal = true;
  addFullSeal = true;
  addSign = true;
  designation='';
  dealQuote: DealQuotation = new DealQuotation();


  ngOnInit() {
    this.loadDealQuotes();
    this.as.getInstituteDetails();
  }

  _search_filters = {
    dealProducts: [],
    institutes: [this.as.getInstituteDetails()],
    agents: [],
    dealType: '',

    quoteNo: '',
    quoteSubject: '',
    quoteDateObject: null,
    quoteDateFrom: null,
    quoteDateTo: null,
    quoteValidDateObject: null,
    quoteValidDateFrom: null,
    quoteValidDateTo: null,
    quoteStage: '',
  }

  loadDealQuotes() {
    this.loading = true;
    this.rowData = [];
    this.ss.loadDealQuotationsReport(this._search_filters).subscribe(res => {
      this.loading = false;
      this._respsResp = new Array();
      this._respsResp = res['DealQuotations'];

      this._respsResp.forEach(resp => {
        let _rowData: any = {};
        _rowData.deal = resp.deal;
        _rowData.dealQuotation = resp.dealQuotation;
        this.quoteList.push(_rowData);
      })
    }, error => { this.loading = false; });
  }


  viewPDF(dealId,fileName) {
    let url = environment.apiUrl + 'download/download-deals-pdf/view/'+dealId+'/'+fileName+'';
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  } 
}
