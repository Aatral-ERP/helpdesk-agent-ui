import { Component, OnInit } from '@angular/core';
import { SalesService } from 'src/app/_services/sales.service';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-purchase-invoices',
  templateUrl: './purchase-invoices.component.html',
  styleUrls: ['./purchase-invoices.component.css']
})
export class PurchaseInvoicesComponent implements OnInit {
  constructor(private ss: SalesService,private as: AuthService) {}
  invoices = [];
  invoiceList = [];
  _search_filters = {
    dealProducts: [],
    institutes: [this.as.getInstituteDetails()],
    agents: [],
    dealType: '',
    invoiceNo: '',
    invoiceSubject: '',
    invoiceDueDateObject: null,
    invoiceDueDateFrom: null,
    invoiceDueDateTo: null,
    invoiceDateObject: null,
    invoiceDateFrom: null,
    invoiceDateTo: null,
    invoiceStatus: '',
  }
  ngOnInit() {
    this.loadInvoices();
    this.as.getInstituteDetails();
  }

  loading = false;
  loadInvoices() {
    this.loading = true;
    this.ss.loadInvoicesReport(this._search_filters).subscribe(res => {
      this.loading = false;
      this.invoices = res['DealInvoices'];
      this.invoices
        .filter(invs => invs.deal != null && invs.dealInvoice != null)
        .forEach(invs => {
          this.invoiceList.push(invs);
        });
    }, error => { this.loading = false; })
  
  }


  viewPDF(dealId,filename) {
    let url = environment.apiUrl + 'download/download-deals-pdf/view/' + dealId + '/' + filename;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }
}
