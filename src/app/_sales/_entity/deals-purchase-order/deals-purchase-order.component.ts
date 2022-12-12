import { Component, OnInit, Input } from '@angular/core';
import { DealPurchaseOrder } from './DealPurchaseOrder';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { Deal } from '../deals-create/Deal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesService } from 'src/app/_services/sales.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
declare var $: any;

@Component({
  selector: 'app-deals-purchase-order',
  templateUrl: './deals-purchase-order.component.html',
  styleUrls: ['./deals-purchase-order.component.css']
})
export class DealsPurchaseOrderComponent implements OnInit {

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  loading = false;
  saving = false;

  showPDFTemplateOptions = false;
  generatingPDF = false;

  shareWhatsappText = '';
  shareWhatsappTo = '';
  constructor(private snackbar: MatSnackBar, private ss: SalesService, private route: Router,private auth: AuthService) { }

  @Input("dealId") dealId: number;

  po: DealPurchaseOrder = new DealPurchaseOrder();
  deal: Deal = new Deal();

  ngOnInit() {
    this.getDealPurchaseOrder();
  }

  saveDealPurchaseOrder() {


    if (this.po.purchaseOrderNo == '') {
      this.snackbar.open('Purchase Order No should not be empty');
      return false;
    }

    this.saving = true;
    this.ss.saveDealPurchaseOrder(this.po).subscribe(res => {
      this.saving = false;
      if (res['StatusCode'] == '00') {
        this.snackbar.open('Saved Successfully');
        this.po = res['DealPurchaseOrder'];

        this.po.purchaseOrderDateObject = { isRange: false, singleDate: { jsDate: (this.po.purchaseOrderDate != null) ? new Date(this.po.purchaseOrderDate) : this.po.purchaseOrderDate } };
        this.po.dueDateObject = { isRange: false, singleDate: { jsDate: (this.po.dueDate != null) ? new Date(this.po.dueDate) : this.po.dueDate } };

      } else if (res['StatusCode'] == '03') {
        this.snackbar.open(res['StatusDesc']);
      } else {
        this.snackbar.open('Somethig went wrong');
      }
    }, error => { this.saving = false; })
  }

  getDealPurchaseOrder() {
    this.loading = true;
    this.ss.getDealPurchaseOrder(this.dealId).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        if (res['Deal'] && res['Deal'] != null) {
          this.deal = res['Deal'];
          if (res['DealPurchaseOrder'] && res['DealPurchaseOrder'] != null) {
            this.po = res['DealPurchaseOrder'];
            this.po.purchaseOrderDateObject = { isRange: false, singleDate: { jsDate: (this.po.purchaseOrderDate != null) ? new Date(this.po.purchaseOrderDate) : this.po.purchaseOrderDate } };
            this.po.dueDateObject = { isRange: false, singleDate: { jsDate: (this.po.dueDate != null) ? new Date(this.po.dueDate) : this.po.dueDate } };
          } else {
            this.po.dealId = this.dealId;
          }
        }
      } else {
        this.snackbar.open('Somethig went wrong');
      }
    }, error => { this.loading = false; })
  }

  clearFilters() {
    this.po = new DealPurchaseOrder();
  }

  UploadGeneratedPurchaseOrderPDF(file: File) {
    console.log(file);

    // if (file.type.toLowerCase() != 'application/pdf') {
    //   this.snackbar.open('Only PDF file type is valid');
    //   return false;
    // }

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
        this.generatingPDF = true;
        this.ss.UploadGeneratedPurchaseOrderPDF(this.po.id, file).subscribe(res => {

          this.generatingPDF = false;
          if (res['StatusCode'] == '00') {
            this.po.filename = res['DealPurchaseOrder']['filename'];
            this.snackbar.open('Uploaded Successfully', 'OK');
            this.viewPDF();
          } else {
            this.snackbar.open('Something went wrong! Try again later');
          }
        })
      }
    })
  }

  viewPDF() {
    let url = environment.apiUrl + 'download/download-deals-pdf/view/' + this.dealId + '/' + this.po.filename;
    window.open(url, 'winname', 'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=auto,height=auto');
  }

  downloadPDF() {
    let url = environment.apiUrl + 'download/download-deals-pdf/download/' + this.dealId + '/' + this.po.filename;
    window.open(url, '_blank');
  }

  openShareWhatsAppModal() {

    this.shareWhatsappText = this.po.subject + '\n' +
      'Purchase Order Number : ' + this.po.purchaseOrderDate + '\n\n' +
      'View Purchase Order by below url : \n' +
      window.location.origin + '/sales/deals/overview/'+this.po.dealId+'/purchaseorder \n\n'
      + 'Thanks\n'+this.auth.getLoginAgentFullName();

    console.log(this.shareWhatsappText);

    $(function () {
      $('#whatsappShareModal').appendTo("body").modal('show');
    });
  }


  shareWhatsApp() {
    let url = `https://wa.me/${this.shareWhatsappTo}?text=${encodeURI(this.shareWhatsappText)}`;
    window.open(url, '_blank');
  }
}
