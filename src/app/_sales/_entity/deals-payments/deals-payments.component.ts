import { Component, OnInit, Input } from '@angular/core';
import { DealPayment } from './DealPayment';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesService } from 'src/app/_services/sales.service';
import { AuthService } from 'src/app/_services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Deal } from '../deals-create/Deal';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { InvoiceService } from 'src/app/_services/invoice.service';

@Component({
  selector: 'app-deals-payments',
  templateUrl: './deals-payments.component.html',
  styleUrls: ['./deals-payments.component.css']
})
export class DealsPaymentsComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private ss: SalesService, private auth: AuthService,
    private router: Router, private actRoute: ActivatedRoute, private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe, private invServ: InvoiceService) {
    this.actRoute.queryParams.subscribe(params => {
      this.expandId = params['expand']
    });
    console.log(this.expandId);
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  @Input("dealId") dealId: number;
  payments: Array<DealPayment> = [];

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
  showAddNewEmail = false;

  receiptTemplate = "Received with thanks from ${institute_name} a sum of ${amount_in_numbers} vide Cheque/DD/Online Reference No. ${reference_no} dated ${payment_date} drawn on ${drawn_on} towards purchase/service of our bill / invoice number ${invoice_no} by ${mode_of_payment}";
  receiptContent = "";
  showReceiptTemplate = false;
  newPayment: DealPayment = new DealPayment();
  emailPayment: DealPayment;
  deal: Deal = new Deal();
  ngOnInit() {
    this.newPayment.dealId = this.dealId;
    this.getDealPayments();
  }

  savePayment() {
    this.expandId = this.newPayment.id;
    this.saving = true;
    this.ss.saveDealPayment(this.newPayment).subscribe(res => {
      this.saving = false;
      if (res['StatusCode'] == '00') {
        this.showAddNewDiv = false;
        this.newPayment = new DealPayment();
        this.snackbar.open('Saved Successfully');
        this.payments = res['DealPayments'];
        this.payments.forEach(pay => {
          pay.paymentDateObject = { isRange: false, singleDate: { jsDate: (pay.paymentDate != null) ? new Date(pay.paymentDate) : pay.paymentDate } };
        })
      } else {
        this.snackbar.open('Somethig went wrong');
      }
    }, error => { this.saving = false; });
  }

  getDealPayments() {
    this.loading = true;
    this.ss.getDealPayments(this.dealId).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        console.log(res);
        this.payments = res['DealPayments'];
        this.deal = res['Deal'];
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
    this.ss.deleteDealPayments(payment).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Deleetd Successfully');
      } else if (resp['StatusCode'] == '02') {
        this.snackbar.open('Deleetd Successfully');
      }
    })
  }

  // deleteCallReport(callReportAll) {
  //   this.ts.deleteCallReport(this.callReportAll.id).subscribe(res => {
  //     if (res['StatusCode'] == '00') {
  //       this.payments = res['DealPayments'];
  //       this.payments.forEach(pay => {
  //         pay.paymentDateObject = { isRange: false, singleDate: { jsDate: (pay.paymentDate != null) ? new Date(pay.paymentDate) : pay.paymentDate } };
  //       })
  //     } else {
  //       this.snackbar.open('Somethig went wrong');
  //     }
  //   })
  // }

  clearFilters() {
    this.newPayment = new DealPayment();
  }

  viewPDF(payment) {
    this.ss.viewPDF(payment.dealId, payment.receiptfilename);
  }

  generateReceipt(payment_template, payment: DealPayment) {
    this.generatingPDF = true;
    let _receiptContent = this.receiptContent;
    console.log("Template::::", payment_template);

    let amount_in_numbers = this.currencyPipe.transform(payment.totalAmount, 'INR');
    let reference_no = payment.referenceno;
    let payment_date = '';
    let drawn_on = payment.drawnon;
    let invoice_no = this.deal.invoiceNo;
    let mode_of_payment = payment.mode;

    if (payment.paymentDate !== undefined && payment.paymentDate != null) {
      payment_date = this.datePipe.transform(payment.paymentDate, 'dd/MM/yyyy');
    }

    let billingTo = this.deal.billingTo + ',\n' + this.deal.institute.instituteName + ',\n'
      + this.deal.billingStreet1 + ',\n' + this.deal.billingStreet2 + ',\n'
      + this.deal.billingCity + ', ' + this.deal.billingState + ',\n'
      + this.deal.billingCountry + ' - ' + this.deal.billingZIPCode;

    this.ss.generateReceipt(payment, payment_template, _receiptContent, payment_date,
      billingTo, this.designation, this.addFullSeal, this.addRoundSeal, this.addSign)
      .subscribe(res => {
        this.generatingPDF = false;
        if (res['StatusCode'] == '00') {
          this.snackbar.open('Generated Successfuly');
          this.getDealPayments();
          if (res['DealPayment']) {
            this.viewPDF(res['DealPayment']);
          }
        } else {
          this.snackbar.open('Something went wrong');
        }
      })
  }

  // generateReceipt(payment) {
  //   this.generatingPDF = true;
  //   let _receiptContent = this.receiptContent;
  //   this.ss.generateReceipt(payment, _receiptContent, this.designation, this.addFullSeal, this.addRoundSeal, this.addSign).subscribe(res => {
  //     this.generatingPDF = false;
  //     if (res['StatusCode'] == '00') {
  //       this.snackbar.open('Generated Successfuly');
  //       this.getDealPayments();
  //       if (res['DealPayment']) {
  //         this.viewPDF(res['DealPayment']);
  //       }
  //     } else {
  //       this.snackbar.open('Something went wrong');
  //     }
  //   })
  // }

  saveAsAmc(payment) {
    this.router.navigate(['institute/amc-entry'], {
      queryParams: {
        paymentid: payment.id
      }
    });
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

  resp(event) {
    console.log(event);
    if (event == 'close' || event == 'success') {
      this.showAddNewEmail = false;
    }
  }

  receiptTemplateChange(payment: DealPayment) {

    let institute_name = this.deal.institute.instituteName;
    let amount_in_numbers = this.currencyPipe.transform(payment.totalAmount, 'INR');
    let reference_no = payment.referenceno;
    let payment_date = '';
    let drawn_on = payment.drawnon;
    let invoice_no = this.deal.invoiceNo;
    let mode_of_payment = payment.mode;

    if (payment.paymentDate !== undefined && payment.paymentDate != null) {
      payment_date = this.datePipe.transform(payment.paymentDate, 'dd/MM/yyyy');
    }

    this.receiptContent = this.receiptTemplate.toString()
      .replace('${institute_name}', institute_name)
      .replace('${amount_in_numbers}', amount_in_numbers)
      .replace('${reference_no}', reference_no)
      .replace('${payment_date}', payment_date)
      .replace('${drawn_on}', drawn_on)
      .replace('${invoice_no}', invoice_no)
      .replace('${mode_of_payment}', mode_of_payment);


    this.receiptContent = this.receiptContent.replace(/\r?\n/g, '<br />').trim();

  }

}
