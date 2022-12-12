import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Deal } from '../deals-create/Deal';
import { SalesService } from 'src/app/_services/sales.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { Title } from "@angular/platform-browser";
import Swal from 'sweetalert2';
import { CurrencyPipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { RoleMaster } from 'src/app/_admin/role-create/RoleMaster';

@Component({
  selector: 'app-deals-view',
  templateUrl: './deals-view.component.html',
  styleUrls: ['./deals-view.component.css']
})
export class DealsViewComponent implements OnInit, OnDestroy {

  ngOnDestroy(): void {
    console.log('onDestroy')
    this.titleService.setTitle(environment.title);
  }

  constructor(private route: Router, private ss: SalesService, private titleService: Title,
    private currencyPipe: CurrencyPipe, private snackbar: MatSnackBar, public su: SalesUtilService) { }

  @Input("dealId") dealId: number;
  @Output("dealEmitter") dealEmitter: EventEmitter<Deal> = new EventEmitter();
  loading = false;

  deal: Deal = new Deal();
  role: RoleMaster = this.ss.auth.getLoggedInRole();
  ngOnInit() {
    this.getDeal();
  }

  getDeal() {

    this.loading = true;
    this.ss.getDealDetails(this.dealId).subscribe(res => {
      this.loading = false;
      if (res['StatusCode'] == '00') {
        if (res['Deal'] != null) {
          this.deal = res['Deal'];
          this.deal.products = res['DealProducts'];
          let dealContacts: Array<any> = res['DealContacts'];
          this.deal.instituteContacts = [];

          if (!this.role.salesAdmin) {
            if (this.deal.createdBy != this.ss.auth.getLoginEmailId()) {
              this.snackbar.open('You are not Creator of this Deal #' + this.deal.id);
              this.route.navigateByUrl('');
            }
          }

          this.titleService.setTitle(this.currencyPipe.transform(this.deal.grandTotal, 'INR') + ' - ' + this.deal.institute.instituteName);
          console.log(this.titleService.getTitle());
          dealContacts.forEach(ic => {
            console.log(ic);
            this.deal.instituteContacts.push(ic.instituteContact);
          })
          this.deal.products.forEach(prod => prod.description = prod.description.replace(/(?:\r\n|\r|\n)/g, '<br>'));
          console.log(this.deal.instituteContacts);

          this.dealEmitter.next(this.deal);
        } else {
          this.snackbar.open('No Deal Found');
        }
      } else {
        this.snackbar.open('No Deal Found');
      }
    })

  }

  EditDeal() {
    this.route.navigateByUrl('/sales/deals/create?edit=1&did=' + this.dealId);
  }

  copyDeal() {
    this.route.navigateByUrl('/sales/deals/create?copy=1&did=' + this.dealId);
  }

  convertAsInvoice() {
    this.route.navigateByUrl('/sales/invoices/create?prefill-from-deal=1&did=' + this.dealId);
  }

  deleteDeal() {

    Swal.fire({
      title: 'Are you sure want to delete?',
      text: "This will delete All associated Deal Details, Quotation, Invoices, etc,.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {
        this.ss.deleteDeal(this.dealId).subscribe(res => {
          if (res['StatusCode'] == "00") {
            this.snackbar.open('Deleted Sucessfully');
            this.route.navigateByUrl('/sales/deals');
          } else if (res['StatusCode'] == "03") {
            this.snackbar.open(res['StatusCode']);
          } else {
            this.snackbar.open('Something went wrong , Try later.');
          }
        })
      }
    })

  }

  routeToInstitutionDetail() {
    this.route.navigateByUrl('/institute/institute-detail?iid=' + this.deal.institute.instituteId);
  }


}
