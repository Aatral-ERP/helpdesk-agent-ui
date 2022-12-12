import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AGGridButtonRendererComponent } from 'src/app/_modules/common/ag-grid-button-renderer.component';
import { LeaveManagementService } from 'src/app/_services/leave-management.service';
import { LeaveMasterCreateComponent } from '../leave-master-create/leave-master-create.component';
import { LeaveMaster } from '../leave-master-create/LeaveMaster';

@Component({
  selector: 'app-leave-master',
  templateUrl: './leave-master.component.html',
  styleUrls: ['./leave-master.component.css']
})
export class LeaveMasterComponent implements OnInit {

  @ViewChild('leaveMasterCreate', { static: false }) leaveMasterCreate: LeaveMasterCreateComponent;

  constructor(private ls: LeaveManagementService, private datePipe: DatePipe, private currencyPipe: CurrencyPipe) {
    this.frameworkComponents = {
      buttonRenderer: AGGridButtonRendererComponent,
    }
  }

  loading = false;
  frameworkComponents: any;
  leavemasters: Array<LeaveMaster> = [];

  columnDefs = [
    {
      headerName: '', field: 'id', width: 40,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.editLeaveMaster.bind(this),
        label: 'Edit'
      }
    },
    { headerName: 'Name', field: 'name', width: 120, sortable: true, filter: true, resizable: true, tooltipValueGetter: (data) => { return data.value } },
    { headerName: 'Annual Leave', field: 'annualLeave', width: 120, sortable: true, filter: true, resizable: true, tooltipValueGetter: (data) => { return data.value } },
    { headerName: 'Casual Leave', field: 'casualLeave', width: 120, sortable: true, filter: true, resizable: true, tooltipValueGetter: (data) => { return data.value } },
    { headerName: 'Sick Leave', field: 'sickLeave', width: 120, sortable: true, filter: true, resizable: true, tooltipValueGetter: (data) => { return data.value } },
    { headerName: 'Other Leave', field: 'otherLeave', width: 120, sortable: true, filter: true, resizable: true, tooltipValueGetter: (data) => { return data.value } },
    { headerName: 'Permissions', field: 'permissions', width: 120, sortable: true, filter: true, resizable: true, tooltipValueGetter: (data) => { return data.value } },    // {
    // {
    //   headerName: 'Carry Forward', field: 'carryForward', width: 120, sortable: true, filter: true, resizable: true, tooltipValueGetter: (data) => { return data.value }, cellRenderer: (data) => {
    //     if (data.value == true)
    //       return `<i class="far fa-check-circle text-success"></i>`;
    //     else
    //       return `<i class="far fa-times-circle text-danger"></i>`;
    //   }
    // },
    // {
    //   headerName: 'Maximum Carry Forward', field: 'maximumCarryForward', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
    //     if (data.data.carryForward == true)
    //       return data.value;
    //     else
    //       return '';
    //   }
    // },
    { headerName: 'Created By', width: 120, field: 'createdBy', sortable: true, filter: true, resizable: true },
    { headerName: 'Modified By', width: 120, field: 'modifiedBy', sortable: true, filter: true, resizable: true },
    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'MMM d, yyyy hh:mm a');
      }
    },
    {
      headerName: 'Last Modified Date', field: 'lastupdatedatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'MMM d, yyyy hh:mm a');
      }
    }

  ];


  ngOnInit() {
    this.getAllLeaveMasters();
  }

  getAllLeaveMasters() {
    this.loading = true;
    this.ls.getAllLeaveMasters().subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.leavemasters = resp['LeaveMasters'];
      }
    }, error => this.loading = false)
  }

  onRespEvent(event) {
    this.getAllLeaveMasters();
  }

  editLeaveMaster(event) {
    console.log(event);
    this.leaveMasterCreate.openCreateModal(event.rowData);
  }

}
