import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SalesService } from 'src/app/_services/sales.service';
import { SalesUtilService } from 'src/app/_services/sales-util.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Deal } from '../deals-create/Deal';

@Component({
  selector: 'app-deals-overview',
  templateUrl: './deals-overview.component.html',
  styleUrls: ['./deals-overview.component.css']
})
export class DealsOverviewComponent implements OnInit {

  constructor(public su: SalesUtilService, private route: Router, private snackbar: MatSnackBar,
    private actRoutor: ActivatedRoute, private ss: SalesService) {
    this.dealId = this.actRoutor.snapshot.params['id'];

    this.actRoutor.params.subscribe(params => {
      console.log(params);

      if (this.actRoutor.snapshot.params['tab'] == 'deal')
        this.tab = 0;
      else if (this.actRoutor.snapshot.params['tab'] == 'quotation')
        this.tab = 1;
      else if (this.actRoutor.snapshot.params['tab'] == 'purchaseorder')
        this.tab = 2;
      else if (this.actRoutor.snapshot.params['tab'] == 'projectimplementation')
        this.tab = 3;
      else if (this.actRoutor.snapshot.params['tab'] == 'salesorder')
        this.tab = 4;
      else if (this.actRoutor.snapshot.params['tab'] == 'proformainvoice')
        this.tab = 5;
      else if (this.actRoutor.snapshot.params['tab'] == 'invoice')
        this.tab = 6;
      else if (this.actRoutor.snapshot.params['tab'] == 'delivery-challan')
        this.tab = 7;
      else if (this.actRoutor.snapshot.params['tab'] == 'payments')
        this.tab = 8;
      else if (this.actRoutor.snapshot.params['tab'] == 'amc-visits')
        this.tab = 9;
      else if (this.actRoutor.snapshot.params['tab'] == 'notes')
        this.tab = 10;
      else if (this.actRoutor.snapshot.params['tab'] == 'emails')
        this.tab = 11;
      else
        this.tab = 0;
    })
  }

  showPDFTemplateOptions = false;
  generatingQuotationPDF = false;
  tab = 0;
  loading = false;
  dealId = '';
  deal: Deal;

  ngOnInit() {
  }

  tabChange(event) {
    console.log(event);

    if (event.index == 0)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/deal']);
    else if (event.index == 1)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/quotation']);
    else if (event.index == 2)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/purchaseorder']);
    else if (event.index == 3)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/projectimplementation']);
    else if (event.index == 4)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/salesorder']);
    else if (event.index == 5)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/proformainvoice']);
    else if (event.index == 6)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/invoice']);
    else if (event.index == 7)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/delivery-challan']);
    else if (event.index == 8)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/payments']);
    else if (event.index == 9)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/amc-visits']);
    else if (event.index == 10)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/notes']);
    else if (event.index == 11)
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/emails']);
    else
      this.route.navigate(['/sales/deals/overview/' + this.dealId + '/deal']);
  }

  onselectedTabChange(event) {
    console.log(event)
  }


}
