import { Component, OnInit } from '@angular/core';
import { HrService } from 'src/app/_services/hr.service';

@Component({
  selector: 'app-hr-dashboard',
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {
  count = {
    staffs: 0,
    work_days: 0,
    present_staff:0,
    products:0,
    new_hires:0
  }
  Att: any[] = [];

  constructor(private hr: HrService) { }

  ngOnInit(){
    this.hr.getHrDashboardDetails().subscribe(res=>
      {
      console.log(res);
      if (res['StatusCode'] == '00') {
         console.log("Inside Success:::");
         this.count = res['Days'];
      }
      })

     this.hr.getAttendanceCount().subscribe(res=>
      {
        console.log(res);
        if (res['StatusCode'] == '00') {
          let Att: Array<any> = res['Att'];
          this.Att = [];

          Att.forEach(count => {
            this.Att.push({ name: count.working_date, value: count.coming_staffs });
          });
        }
      }, error => { console.log(error); }); 
  }
  surveyData = [
    { name: 'Bikes', value: 105000 },
    { name: 'Cars', value: 55000 },
    { name: 'Trucks', value: 15000 },
    { name: 'Scooter', value: 150000 },
    { name: 'Bus', value: 20000 }
  ];

  view: any[] = [800, 300];

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Country';
  showYAxisLabel: boolean = true;
  xAxisLabel: string = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A94935', '#9B665B', '#202E6F', '#A10A28', '#C7B42C', '#AAAAAA', '#316A64', '#DE4047', '#F07B20', '#CDDA4F']
  };

}