import { Component, OnInit } from '@angular/core';
import { LeaveManagementService } from 'src/app/_services/leave-management.service';
import { LeaveApplied } from '../apply-leave/LeaveApplied';

@Component({
  selector: 'app-applied-leave',
  templateUrl: './applied-leave.component.html',
  styleUrls: ['./applied-leave.component.css']
})
export class AppliedLeaveComponent implements OnInit {

  constructor(private ls: LeaveManagementService) { }

  leavesApplied: Array<LeaveApplied> = [];

  loading = false;

  ngOnInit() {
    this.getMyAllAppliedLeaves();
  }

  getMyAllAppliedLeaves() {
    this.loading = true;
    this.ls.getMyAllAppliedLeaves(this.ls.auth.getAgentDetails()).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.leavesApplied = resp['LeavesApplied'];
        this.leavesApplied.sort((a, b) => b.id - a.id).forEach(leave => {
          if (leave.reason != null)
            leave.reason.replace(/(?:\r\n|\r|\n)/g, '<br>')
        })
      }
    }, error => this.loading = false)
  }

  getWhichHalf(leaveFromDate: Date) {
    return new Date(leaveFromDate).getHours() == 10 ? 'First Half' : 'Second Half';
  }

}
