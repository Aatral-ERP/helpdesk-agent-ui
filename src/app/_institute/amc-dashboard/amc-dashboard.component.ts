import { Component, OnInit } from '@angular/core';
import { InstituteService } from 'src/app/_services/institute.service';
import { AgentService } from 'src/app/_services/agent.service';
import { Router } from '@angular/router';
import { Institute } from 'src/app/_onboard/inst-registration/institute';
import { NeededService } from 'src/app/_services/needed.service';

@Component({
  selector: 'app-amc-dashboard',
  templateUrl: './amc-dashboard.component.html',
  styleUrls: ['./amc-dashboard.component.css']
})
export class AmcDashboardComponent implements OnInit {

  lastLoadedDate = null;
  tab = 0;

  constructor(private is: InstituteService, private as: AgentService, private route: Router,
    private needed: NeededService) { }

  instituteProducts: Array<any> = [];
  tabData: any = {};
  tabData_show = [];

  tabs = [];

  showProgress = false;
  searchStr = '';
  searchStr1 = '';

  ngOnInit() {
    this.loadAMCDataFromAPI();
    // this.loadNeeded();
  }

  // loadNeeded() {
  //   this.needed.loadNeeded(['institutes_min', 'products_min']).subscribe(resp => {
  //     if (resp['StatusCode'] == '00') {
  //       this.institutes = resp['institutes_min'];
  //       this.products = resp['products_min'];
  //     }
  //   })
  // }

  loadAMCDataFromAPI() {

    this.showProgress = true;
    this.as.getInstituteProductsAll([], [], [], null, null, true).subscribe(res => {
      console.log(res); this.showProgress = false;
      if (res['StatusCode'] == '00') {
        this.instituteProducts = res['InstituteProducts'];

        this.tabData = res['TabData'];

        this.tabs = res['Tabs'];

        console.log(this.tabs);

        this.prepareChartData();

      }
    }, error => this.showProgress = false);
  }

  getTabData(tab) {
    if (this.tabData[tab] !== undefined) {
      return Array.from(this.tabData[tab]).filter((ip: any) => {
        if (this.searchStr !== undefined && this.searchStr != null && this.searchStr != '')
          return ip.institute.instituteName.toLowerCase().includes(this.searchStr.toLowerCase())
        else
          return true;
      });
    } else {
      return [];
    }
  }

  performReminderDashboardData(instituteStr?: string) {

  }

  filter(type, event) {
    if (type == 'institute')
      this.performReminderDashboardData(event)
  }

  clrStr() {
    console.log("Inside Clr::");
    this.searchStr = '';
  }

  clrStr1() {
    console.log("Inside Clr1::");
    this.searchStr1 = '';
  }

  routeToCreateAMC(ip) {
    this.route.navigateByUrl('/sales/deals/create?prefill-amc-institute=1&iid=' + ip.institute.instituteId);
  }

  getDayDiff(amcExpiryDate) {
    const date1 = new Date();
    const date2 = new Date(amcExpiryDate);
    const diffTime = +date2 - +date1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getDayDiffText(diffDays) {
    if (diffDays == 0)
      return "Expires today";
    else if (diffDays > 0)
      return "Expires in " + diffDays + " day(s)";
    else
      return "Expired " + Math.abs(diffDays) + " day(s) ago";
  }

  // Charts

  colorScheme = {
    domain: ['#5AA454']
  };
  chartdata: any[] = [];

  view: any[] = [(window.innerWidth * 0.95), 300];
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Amount';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Months';

  prepareChartData() {

    let _date: Array<Date> = [];
    for (let ip of this.instituteProducts) {
      if (ip.lastAMCPaidDate != null)
        _date.push(new Date(ip.lastAMCPaidDate));
    }

    let _month_year_str: Set<string> = new Set();
    _date.sort((a, b) => +a - +b).forEach(date => {
      _month_year_str.add(new Date(date).getFullYear() + '-' + new Date(date).getMonth());
    });

    console.log(_month_year_str);

    let _month_year: Array<string> = Array.from(_month_year_str).slice(0, 12);

    console.log(_month_year);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let _chartdata = [];
    _month_year.forEach(month_year => {
      let cnt = 0; let amount = 0;
      this.instituteProducts
        .filter(ip => new Date(ip.lastAMCPaidDate).getMonth() == +month_year.split('-')[1] && new Date(ip.lastAMCPaidDate).getFullYear() == +month_year.split('-')[0])
        .forEach(ip => {
          cnt = cnt + 1;
          amount = amount + ip.amcAmount;
        })

      _chartdata.push({ month_year: month_year, cnt: cnt, value: amount, name: monthNames[+month_year.split('-')[1]] + ' ' + month_year.split('-')[0] + '(' + cnt + ')' });
    });
    this.chartdata = [];
    if (_chartdata.length > 0)
      this.chartdata.push({ name: "AMC", series: _chartdata });
  }
}

export class InstituteProductsTabData {
  institute: Institute;
  products: Array<any> = [];
  showIn: Set<any> = new Set();
}
