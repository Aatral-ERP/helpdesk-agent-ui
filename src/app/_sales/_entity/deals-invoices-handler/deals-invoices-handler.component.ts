import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SalesService } from 'src/app/_services/sales.service';
import { Deal, Product } from '../deals-create/Deal';
import { DealInvoice } from '../deals-invoice/DealInvoice';
import { DealInvoiceProducts } from '../deals-invoice/DealInvoiceProducts';

@Component({
  selector: 'app-deals-invoices-handler',
  templateUrl: './deals-invoices-handler.component.html',
  styleUrls: ['./deals-invoices-handler.component.css']
})
export class DealsInvoicesHandlerComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private ss: SalesService) { }

  @Input("dealId") dealId: number;
  loading = false;
  showAddNewDiv = false;

  dealInvoices: Array<DealInvoice> = [];
  deal: Deal = new Deal();
  dealProducts: Array<Product> = [];

  dealInvoiceProducts: Array<DealInvoiceProducts> = [];

  ngOnInit() {
    this.getDealInvoice();
  }

  getDealInvoice() {

    this.loading = true;
    this.ss.getDealInvoice(this.dealId).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        if (res['Deal'] && res['Deal'] != null) {
          this.deal = res['Deal'];
          if (res['DealInvoice'] != null) {
            this.dealInvoices = res['DealInvoice'];
          }
        }
      } else {
        this.snackbar.open('Somethig went wrong');
      }
    }, error => { this.loading = false; })

  }


}
