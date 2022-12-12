import { Component, OnInit } from '@angular/core';
import { IMyDateModel, IAngularMyDpOptions } from 'angular-mydatepicker';
import { LeaveManagementService } from 'src/app/_services/leave-management.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-holidays',
  templateUrl: './holidays.component.html',
  styleUrls: ['./holidays.component.css']
})
export class HolidaysComponent implements OnInit {

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  constructor(private ls :LeaveManagementService) { }

  ngOnInit() {
  }

  leaveType='CLOSED HOLIDAY';
  holidayDateObject: IMyDateModel = { isRange: false, singleDate: { jsDate: new Date() } };
  holidayDate: any = this.holidayDateObject.singleDate.jsDate;
  reason = '';
  saving=false;
  loading = false;
  id=0;
  

  saveHoliday(){
    this.saving=true;
   this.ls.saveHoliday(this.id,this.holidayDate,this.reason,this.leaveType).subscribe(res=>{

    this.saving=false;

    if (res['StatusCode'] == '00') {
      Swal.fire('Saved Successfully', '', 'success');
    }
    else {
      Swal.fire('Failed to process the request', '', 'error');
    }
   })

  }

  clearFilters(){
    
  }

}
