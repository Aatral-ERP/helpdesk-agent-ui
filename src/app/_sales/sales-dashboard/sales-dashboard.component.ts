import { Component, OnInit, HostListener } from '@angular/core';
import { SalesService } from 'src/app/_services/sales.service';
import { Base64 } from 'js-base64';
import { IAngularMyDpOptions } from 'angular-mydatepicker';

@Component({
  selector: 'app-sales-dashboard',
  templateUrl: './sales-dashboard.component.html',
  styleUrls: ['./sales-dashboard.component.css'],
})
export class SalesDashboardComponent implements OnInit {
  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };
  // view: any[] = [900, 200];
  loading = false;
  colorsarray = ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#ff0000', '#ffbf00', '#00ff40', '#0000ff', '#ff00bf', '#ff0000', '#3399ff', '#336600'];
  _dealTypeDatas = [];
  _modeTypeDatas = [];
  productwiseSalesReport = [];
  _productwiseRevenueChartDatas = [];
  _productwiseNoOfOrdersChartDatas = [];

  // Line Chart Contents
  _dealTypeDatasGraph = [];
  linechartview: any[] = [window.innerWidth, 300];
  piechartview: any[] = [window.innerWidth / 2, 200];

  dealTypeDatasColorArray = {
    domain: ['#7aa3e5', '#a8385d', '#5AA454', '#E44D25', '#CFC0BB', '#aae3f5']
  };
  modeTypeDatasColorArray = {
    domain: ['#5AA454', '#A10A28', '#3399ff', '#336600', '#C7B42C']
  };
  dealTypeDatasGraphColorArray = {
    domain: ['#A10A28', '#C7B42C', '#00ff40', '#0000ff', '#AAAAAA', '#ff0000', '#ffbf00', '#5AA454', '#ff00bf', '#ff0000', '#3399ff', '#336600']
  };

  constructor(private ss: SalesService) {

    this._search_filters = {
      fromDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      toDate: new Date(),
      dateObject: {
        isRange: true, singleDate: null, dateRange: {
          beginJsDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          endJsDate: new Date()
        }
      }
    }
  }
  Stats: any = {
    invoiceCount: 0,
    poCount: 0,
    quotationCount: 0,
    totalAmount: 0,
    taxableAmount: 0
  };
  Payments = [];
  lastLoadedDate = null;

  ngOnInit() {
    this.loadSalesDashboardData();
  }

  loadSalesDashboardData() {
    if (localStorage.getItem('_sales_dashboard_records_fetch_date_time')) {
      let lastLoadedDate = localStorage.getItem('_sales_dashboard_records_fetch_date_time').replace(/"/g, '');
      this.lastLoadedDate = new Date(lastLoadedDate);
      this._search_filters.fromDate = new Date(localStorage.getItem('_sales_dashboard_resp_from_date').replace(/"/g, ''));
      this._search_filters.toDate = new Date(localStorage.getItem('_sales_dashboard_resp_to_date').replace(/"/g, ''));
      this._search_filters.dateObject = {
        isRange: true, singleDate: null, dateRange: {
          beginJsDate: this._search_filters.fromDate,
          endJsDate: this._search_filters.toDate
        }
      }
      if (this.getDayDiff(this.lastLoadedDate) == 0) {
        let resp = JSON.parse(Base64.decode(localStorage.getItem('_sales_dashboard_resp')));

        this.handleSalesDashboardData(resp);
      } else {
        this.getSalesDashboardDataFromAPI();
      }
    } else {
      this.getSalesDashboardDataFromAPI();
    }
  }

  getSalesDashboardDataFromAPI() {
    this.loading = true;
    console.log(this._search_filters.fromDate, new Date(this._search_filters.fromDate));
    this.ss.getSalesDashboardData(this._search_filters).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == "00") {

        this.handleSalesDashboardData(resp);

        localStorage.setItem('_sales_dashboard_resp', Base64.encode(JSON.stringify(resp)));
        localStorage.setItem('_sales_dashboard_resp_from_date', JSON.stringify(this._search_filters.fromDate));
        localStorage.setItem('_sales_dashboard_resp_to_date', JSON.stringify(this._search_filters.toDate));
        localStorage.setItem('_sales_dashboard_records_fetch_date_time', JSON.stringify(new Date()));
        this.lastLoadedDate = localStorage.getItem('_sales_dashboard_records_fetch_date_time').replace(/"/g, '');
      }
    }, error => this.loading = false);
  }

  handleSalesDashboardData(resp) {
    console.log(resp);
    this.Stats = resp['Stats'];
    this.Payments = resp['Payments'];
    this._dealTypeDatasGraph = resp['last10MonthsSalesData'];
    this.productwiseSalesReport = resp['productwiseSalesReport'];

    this.prepareDealTypeData();
    this.preparePaymentTypeData();
    this.prepareProductwiseRevenueReportData();
  }

  prepareProductwiseRevenueReportData() {
    this._productwiseRevenueChartDatas = [];
    this._productwiseNoOfOrdersChartDatas = [];

    this.productwiseSalesReport.forEach(data => {
      this._productwiseRevenueChartDatas.push({ name: data.name + '', value: data.total_price });
      this._productwiseNoOfOrdersChartDatas.push({ name: data.name + ' (Qty:' + data.quantity + ')', value: data.no_of_orders });
    });
  }

  prepareDealTypeData() {
    let type: Set<string> = new Set();
    this._dealTypeDatas = [];
    this.Payments.forEach(pay => {
      type.add(pay.dealType);
    });

    type.forEach(_type => {
      let amount = 0;
      this.Payments.filter(pay => pay.dealType == _type).forEach(pay => {
        amount = amount + pay.totalAmount;
      });
      this._dealTypeDatas.push({ name: _type, value: amount });
    })

  }

  preparePaymentTypeData() {
    let type: Set<string> = new Set();
    this._modeTypeDatas = [];
    this.Payments.forEach(pay => {
      pay.mode = new String(pay.mode).toUpperCase();
      type.add(pay.mode);
    });

    type.forEach(_type => {
      let amount = 0;
      this.Payments.filter(pay => pay.mode == _type).forEach(pay => {
        amount = amount + pay.totalAmount;
      });
      this._modeTypeDatas.push({ name: _type, value: amount });
    })

  }

  getDayDiff(amcExpiryDate) {
    const date1 = new Date();
    const date2 = new Date(amcExpiryDate);
    const diffTime = +date2 - +date1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }



  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(event.target.innerWidth);
    this.linechartview = [event.target.innerWidth - 50, 300];
    if (event.target.innerWidth > 767)
      this.piechartview = [event.target.innerWidth / 2, 200];
    else
      this.piechartview = [event.target.innerWidth, 200];
  }

  // Product wise Data


  _search_filters = {

    fromDate: null,
    toDate: null,
    dateObject: {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: null,
        endJsDate: null
      }
    }

  }

}
