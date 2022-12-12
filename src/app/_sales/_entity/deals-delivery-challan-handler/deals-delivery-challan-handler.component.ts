import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SalesService } from 'src/app/_services/sales.service';
import { Deal } from '../deals-create/Deal';
import { DeliveryChallan } from '../deals-delivery-challan/deliverychallan';

@Component({
  selector: 'app-deals-delivery-challan-handler',
  templateUrl: './deals-delivery-challan-handler.component.html',
  styleUrls: ['./deals-delivery-challan-handler.component.css']
})
export class DealsDeliveryChallanHandlerComponent implements OnInit {

  constructor(private ss: SalesService, private snackbar: MatSnackBar) { }

  @Input() dealId: number;
  @Input() deal: Deal;
  showDCEdit = false;

  dcs: Array<DeliveryChallan> = [];
  dc: DeliveryChallan = new DeliveryChallan();

  loading = false;

  ngOnInit() {
    this.getDealDeliveryChallans();
  }

  getDealDeliveryChallans() {
    this.loading = true;
    this.ss.getDealDeliveryChallan(this.dealId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.dcs = resp['DealDeliveryChallans'];
      } else {
        this.snackbar.open('Something went wrong, Try later');
      }
    }, error => this.loading = false)
  }

  convertDC(_dc?) {
    this.showDCEdit = false;
    if (_dc !== undefined)
      this.dc = _dc;
    else
      this.dc = new DeliveryChallan();
    this.showDCEdit = true;
  }

  dcUpdate(_delivery_challan: DeliveryChallan) {
    if (this.dcs.find(dc => dc.id == _delivery_challan.id) !== undefined) {
      let index = this.dcs.findIndex(dc => dc.id == _delivery_challan.id);

      this.dcs[index] = _delivery_challan;
    } else {
      this.dcs.push(_delivery_challan);
    }
    this.dc = new DeliveryChallan();
    this.getDealDeliveryChallans();
    this.showDCEdit = false;
  }

  deleteDC(dc: DeliveryChallan) {
    this.loading = true;
    this.ss.deleteDealDeliveryChallan(dc).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.getDealDeliveryChallans();
      } else {
        this.snackbar.open('Something went wrong, Try later');
      }
    }, error => this.loading = false)
  }
}
