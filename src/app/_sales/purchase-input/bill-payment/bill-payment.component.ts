import { Component, OnInit, Input } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { BillPayment } from './BillPayment';
import { PurchaseInputService } from 'src/app/_services/purchase-input.service';

@Component({
  selector: 'app-bill-payment',
  templateUrl: './bill-payment.component.html',
  styleUrls: ['./bill-payment.component.css']
})
export class BillPaymentComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private pis: PurchaseInputService, private auth: AuthService,
    private router: Router, private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe) { }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  @Input("billId") billId: number;

  payments: Array<BillPayment> = [];

  expandId = 0;

  loading = true;
  saving = false;
  showAddNewDiv = false;
  addRoundSeal = true;
  addFullSeal = true;
  addSign = true;
  designation = this.auth.getLoginAgentDesignation();
  generatingPDF = false;
  institute = [];
  instName = '';
  gstPercent = 18;

  newPayment: BillPayment = new BillPayment();
  ngOnInit() {
    this.newPayment.billId = this.billId;
    this.getBillPayments();
  }

  savePayment() {
    this.expandId = this.newPayment.id;
    this.saving = true;
    this.pis.saveBillPayment(this.newPayment).subscribe(res => {
      this.saving = false;
      if (res['StatusCode'] == '00') {
        this.showAddNewDiv = false;
        this.newPayment = new BillPayment();
        this.snackbar.open('Saved Successfully');
        this.payments = res['BillPayments'];
        this.payments.forEach(pay => {
          pay.paymentDateObject = { isRange: false, singleDate: { jsDate: (pay.paymentDate != null) ? new Date(pay.paymentDate) : pay.paymentDate } };
        })
      } else {
        this.snackbar.open('Somethig went wrong');
      }
    }, error => { this.saving = false; });
  }

  getBillPayments() {
    this.loading = true;
    this.pis.getBillPayments(this.billId).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        console.log(res);
        this.payments = res['BillPayments'];
        this.payments.forEach(pay => {
          pay.paymentDateObject = { isRange: false, singleDate: { jsDate: (pay.paymentDate != null) ? new Date(pay.paymentDate) : pay.paymentDate } };
          console.log(pay.amount, pay.gstAmount, pay.amount / pay.gstAmount * 100, (pay.amount / pay.gstAmount) * 100);

        });

      } else {
        this.snackbar.open('Somethig went wrong');
      }
    }, error => { this.loading = false; })
  }

  editPayment(payment) {
    this.showAddNewDiv = true;
    this.newPayment = Object.assign({}, payment);
  }

  deletePayment(payment) {
    this.pis.deleteDealPayments(payment).subscribe(res => {
      if (res['StatusCode'] == '00') {
        this.payments = res['BillPayments'];
        this.payments.forEach(pay => {
          pay.paymentDateObject = { isRange: false, singleDate: { jsDate: (pay.paymentDate != null) ? new Date(pay.paymentDate) : pay.paymentDate } };
        })
      } else {
        this.snackbar.open('Somethig went wrong');
      }
    })
  }

  clearFilters() {
    this.newPayment = new BillPayment();
  }


  changeAmcAmount() {
    if (this.newPayment.amount > 0) {
      if (this.gstPercent > 0) {
        this.newPayment.gstAmount = this.newPayment.amount * (+this.gstPercent / 100);

        this.newPayment.totalAmount = this.newPayment.amount + this.newPayment.gstAmount;
        console.log(this.newPayment.amount, this.newPayment.gstAmount);
      } else {
        this.newPayment.totalAmount = this.newPayment.amount;
      }
    }
  }

  changeGstPercentage() {
    if (this.gstPercent == 0) {
      this.newPayment.totalAmount = this.newPayment.amount;
    } else {
      this.newPayment.gstAmount = this.newPayment.amount * (+this.gstPercent / 100);
      this.newPayment.totalAmount = this.newPayment.amount + this.newPayment.gstAmount;
      console.log(this.newPayment.amount, this.newPayment.gstAmount);
    }
  }

  changeTotalAmount() {
    if (this.newPayment.totalAmount > 0) {
      if (this.gstPercent > 0) {
        let totalAmount = this.newPayment.totalAmount;
        this.newPayment.gstAmount = ((totalAmount) / (100 + +this.gstPercent)) * +this.gstPercent;
        this.newPayment.amount = totalAmount - this.newPayment.gstAmount;

        console.log(totalAmount, this.gstPercent, this.newPayment.gstAmount, this.newPayment.amount);

      } else {
        this.newPayment.amount = this.newPayment.totalAmount;
      }
    }
  }

}
