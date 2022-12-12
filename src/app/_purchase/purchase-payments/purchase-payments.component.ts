import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/_services/sales.service';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-purchase-payments',
  templateUrl: './purchase-payments.component.html',
  styleUrls: ['./purchase-payments.component.css']
})
export class PurchasePaymentsComponent implements OnInit {

  constructor(private ss: SalesService,private as: AuthService) { }

  payments = [];
  paymentList = [];
  _search_filters = {
    dealProducts: [],
    institutes: [this.as.getInstituteDetails()],
    agents: [],
    dealType: '',

    paymentReferenceNo: '',
    paymentReceiptNo: '',
    paymentSubject: '',
    paymentMode: '',
    paymentDateFrom: null,
    paymentDateTo: null,
    paymentDateObject: null,
    paymentDrawnOn: '',
    paymentAmount: ''
  }

  ngOnInit() {
    this.loadPayments();
    this.as.getInstituteDetails();
  }

  loading = false;
  loadPayments() {
    this.loading = true;
    this.ss.loadPaymentsReport(this._search_filters).subscribe(res => {
      console.log(res);
      this.loading = false;
      this.payments = res['DealPayments'];
      this.payments
        .filter(paym => paym.deal != null && paym.payment != null)
        .forEach(paym => {
          this.paymentList.push(paym);
        });
    }, error => { this.loading = false; })
  
  }


  viewPDF(dealId,filename) {
    let url = environment.apiUrl + 'download/download-deals-pdf/view/' + dealId + '/' + filename;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

}
