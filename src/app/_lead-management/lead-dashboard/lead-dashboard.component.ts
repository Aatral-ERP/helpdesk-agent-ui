import { Component, HostListener, OnInit } from '@angular/core';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { LeadManagementService } from 'src/app/_services/lead-management.service';

@Component({
  selector: 'app-lead-dashboard',
  templateUrl: './lead-dashboard.component.html',
  styleUrls: ['./lead-dashboard.component.css']
})
export class LeadDashboardComponent implements OnInit {

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  loading = false;
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.viewFull = [event.target.innerWidth - 50, 300];
    this.viewFull200 = [event.target.innerWidth - 50, 200];
    this.viewHalf = [(event.target.innerWidth / 2) - 25, 200];
  }

  constructor(private ls: LeadManagementService) {
    this._search_filters = {
      fromDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
      toDate: new Date(),
      dateObject: {
        isRange: true, singleDate: null, dateRange: {
          beginJsDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
          endJsDate: new Date()
        }
      }
    }
  }
  viewFull: any[] = [window.innerWidth, 300];
  viewFull200: any[] = [window.innerWidth, 200];
  viewHalf: any[] = [window.innerWidth / 2, 200];

  colorArrayLeadByStates = { domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#b3003b', '#ffbf00', '#00ff40', '#0000ff', '#ff00bf', '#ff0000', '#3399ff', '#336600','#e60000','#cc0066','#e64d00','#669900','#00ff00','#ff00ff','#ff0040'] }
  colorArrayLeadByOwnerAndStage = { domain: ['#7aa3e5', '#a8385d', '#000033', '#E44D25', '#CFC0BB', '#aae3f5' ,'#ff00ff','#669900','#00ff00','#ff0040','#ffff1a','#9900ff','#b30047','#003300','#001a33','#cc0066','#ff00bf','#990066']  };

  leadOwnerByStatusData: any = [];
  mostLeadsByOwnersData: any = [];
  leadBySourceData: any = [];
  leadByStatesData: any = [];
  leadByCategoryData: any = [];
  leadByStatusData: any = [];
  leadByProductsData: any = [];

  ngOnInit() {
    this.getLeadDashboardDataFromAPI();
  }

  getLeadDashboardDataFromAPI() {

    this.loading = true;
    this.ls.loadLeadDashboardData(this._search_filters).subscribe(resp => {
      this.loading = false;
      this.prepareLeadOwnerByStatusData(resp['LeadOwnerByStatus']); // bar-horizontal-stacked
      this.prepareMostLeadsByOwnerData(); // gauge
      this.prepareLeadBySourcesData(resp['LeadBySources']); // pie-grid
      this.prepareLeadByCategoryData(resp['LeadByCategory']);

      // this.prepareLeadByStatusData(resp['LeadByStatus']);
      this.prepareLeadByStatesData(resp['LeadByStates']); // advanced-pie-chart
      this.prepareLeadByProductsData(resp['LeadByProducts']); // horizontal-bar-chart

      console.log(this.leadOwnerByStatusData);
      console.log(this.mostLeadsByOwnersData);
      console.log(this.leadBySourceData);
      console.log(this.leadByStatesData);
      // console.log(this.leadByCategoryData);
      // console.log(this.leadByStatusData);
      console.log(this.leadByProductsData);

    })
  }

  prepareLeadOwnerByStatusData(_data: Array<any>) {
    let uniqueMailIds = Array.from(new Set(_data.map(data => data['owner_email_id'])));

    this.leadOwnerByStatusData = uniqueMailIds.map(mailId => Object.assign({}, {
      'name': _data.find(data => data['owner_email_id'] == mailId).owner_name,
      'series': _data
        .filter(data => data['owner_email_id'] == mailId)
        .map(data => Object.assign({}, { 'name': data.status, 'value': data.cnt }))
    }));
  }

  prepareMostLeadsByOwnerData() {
    this.mostLeadsByOwnersData = this.leadOwnerByStatusData.map(_data => {
      let series = Array.from(_data['series']).find(_series => _series['name'] == 'New Lead');
      console.log(_data['name'], series);
      return Object.assign({}, {
        'name': _data['name'],
        'value': series !== undefined ? series['value'] : 0
      })
    })
  }

  prepareLeadBySourcesData(_data: Array<any>) {
    this.leadBySourceData = _data.map(data => {
      return {
        'name': data['lead_source'],
        'value': data['cnt']
      }
    })
  }

  prepareLeadByCategoryData(_data: Array<any>) {
    this.leadByCategoryData = _data.map(data => {
      return {
        'name': data['category'],
        'value': data['cnt']
      }
    })
  }

  prepareLeadByStatusData(_data: Array<any>) {
    this.leadByStatusData = _data.map(data => {
      return {
        'name': data['status'],
        'value': data['cnt']
      }
    })
  }

  prepareLeadByStatesData(_data: Array<any>) {
    this.leadByStatesData = _data.map(data => {
      return {
        'name': data['state'],
        'value': data['cnt']
      }
    })
  }

  prepareLeadByProductsData(_data: Array<any>) {
    this.leadByProductsData = Object.keys(_data).map(key => { return { 'name': key, 'value': _data[key] } });
  }

}
