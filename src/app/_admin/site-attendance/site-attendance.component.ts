import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TicketService } from 'src/app/_services/ticket.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AgentService } from 'src/app/_services/agent.service';
import { SiteAttendance } from './SiteAttendance';
import Swal from 'sweetalert2';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
declare var google: any;
declare var $: any;

@Component({
  selector: 'app-site-attendance',
  templateUrl: './site-attendance.component.html',
  styleUrls: ['./site-attendance.component.css']
})
export class SiteAttendanceComponent implements OnInit, AfterViewInit {

  constructor(private ts: TicketService, private as: AgentService) { }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
  };
  dates = null;
  _agents = [];
  _institutes = [];

  institutes = [];
  agents = [];

  SiteAttendances: Array<SiteAttendance> = [];

  _agentsDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'employeeId',
    textField: 'firstName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  _instituteDropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'instituteId',
    textField: 'instituteName',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true
  };

  texto: string = 'Helpdesk Site Attendance';
  lat: number = 13.023314;
  lng: number = 80.168321;
  zoom: number = 13;
  @ViewChild('mapContainer', { static: false }) gmap: ElementRef;

  ngOnInit() {
    this.getTicketsReportData();
  }
  ngAfterViewInit() {
  }

  tabToGmap(lat, lng) {
    if (lat != null && lat != '' && lng != null && lng != '') {
      window.open("https://www.google.com/maps?q=" + lat + ',' + lng);
    }
  }

  mapInitializer(lat, lng) {

    $(function () {
      $('#modal').appendTo("body").modal('show');
    });

    let coordinates = new google.maps.LatLng(lat, lng);
    let mapOptions = {
      center: coordinates,
      zoom: 15,
    };
    let map = new google.maps.Map(this.gmap.nativeElement,
      mapOptions);

    let marker = new google.maps.Marker({
      position: coordinates,
      map: map,
    });

    marker.setMap(map);


  }

  getTicketsReportData() {
    this.ts.getTicketsReportData().subscribe(res => {
      // console.log(res);
      this._institutes = res['Institutes'];
      this._agents = res['Agents'];
    });
  }



  getSiteAttendances() {

    this.SiteAttendances = [];
    let fromDate = null;
    let toDate = null;
    if (this.dates != null) {
      try {
        console.log(this.dates);
        fromDate = new Date(this.dates['dateRange']['beginJsDate']);
        toDate = new Date(this.dates['dateRange']['endJsDate']);
      } catch (err) {
        console.log(err);
        fromDate = null; toDate = null;
      }
    }

    if (this.institutes.length == 0 && this.agents.length == 0 && fromDate == null && toDate == null) {
      Swal.fire('Select Atleast one Field', '', 'info');
      return false;
    }
    this.as.getSiteAttendances(this.institutes, this.agents, fromDate, toDate).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this.SiteAttendances = res['SiteAttendances'];
        if (this.SiteAttendances.length == 0)
          Swal.fire('No Site Attendance Found', '', 'info');
      } else {
        Swal.fire(res['StatusDesc'], '', 'error');
      }

    })

  }

}
