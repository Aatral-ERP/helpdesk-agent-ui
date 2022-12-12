import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RoleMaster } from '../role-create/RoleMaster';
import { ButtonRendererComponent } from './button-renderer.component';
import { RoleCreateComponent } from '../role-create/role-create.component';
import { AgentService } from 'src/app/_services/agent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-role-master',
  templateUrl: './role-master.component.html',
  styleUrls: ['./role-master.component.css']
})
export class RoleMasterComponent implements OnInit {

  @ViewChild('role', { static: false }) role: RoleCreateComponent;

  constructor(private as: AgentService, private snackbar: MatSnackBar, private datePipe: DatePipe) {
    this.frameworkComponents = {
      buttonRenderer: ButtonRendererComponent,
    }
  }

  loading = false;
  roles: Array<RoleMaster> = [];
  frameworkComponents: any;

  columnDefs = [
    {
      headerName: '', field: 'id', width: 40,
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.editRole.bind(this),
        label: 'Edit'
      }
    },
    { headerName: 'Name', field: 'name', width: 120, sortable: true, filter: true, resizable: true, tooltipValueGetter: (data) => { return data.value } },
    {
      headerName: 'Product', field: 'product', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'No Access')
          return `<span class='text-danger'>${data.value}</span>`;
        else
          return `<span class='text-success'>${data.value}</span>`;
      }
    },
    {
      headerName: 'Institute', field: 'institute', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'No Access')
          return `<span class='text-danger'>${data.value}</span>`;
        else
          return `<span class='text-success'>${data.value}</span>`;
      }
    },
    {
      headerName: 'Supplier', field: 'supplier', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'No Access')
          return `<span class='text-danger'>${data.value}</span>`;
        else
          return `<span class='text-success'>${data.value}</span>`;
      }
    },
    {
      headerName: 'Lead Management', field: 'leadManagement', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'No Access')
          return `<span class='text-danger'>${data.value}</span>`;
        else
          return `<span class='text-success'>${data.value}</span>`;
      }
    },
    {
      headerName: 'Lead Management Admin', field: 'leadManagementAdmin', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == true)
          return `<i class="far fa-check-circle text-success"></i>`;
        else
          return `<i class="far fa-times-circle text-danger"></i>`;
      }
    },
    {
      headerName: 'Sales', field: 'sales', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'No Access')
          return `<span class='text-danger'>${data.value}</span>`;
        else
          return `<span class='text-success'>${data.value}</span>`;
      }
    },
    {
      headerName: 'Sales Admin', field: 'salesAdmin', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == true)
          return `<i class="far fa-check-circle text-success"></i>`;
        else
          return `<i class="far fa-times-circle text-danger"></i>`;
      }
    },
    {
      headerName: 'Purchase Input', field: 'purchaseInput', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'No Access')
          return `<span class='text-danger'>${data.value}</span>`;
        else
          return `<span class='text-success'>${data.value}</span>`;
      }
    },
    {
      headerName: 'Accounting', field: 'accounting', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'No Access')
          return `<span class='text-danger'>${data.value}</span>`;
        else
          return `<span class='text-success'>${data.value}</span>`;
      }
    },
    {
      headerName: 'HR', field: 'hr', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'No Access')
          return `<span class='text-danger'>${data.value}</span>`;
        else
          return `<span class='text-success'>${data.value}</span>`;
      }
    },
    {
      headerName: 'Admin', field: 'admin', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'No Access')
          return `<span class='text-danger'>${data.value}</span>`;
        else
          return `<span class='text-success'>${data.value}</span>`;
      }
    },
    {
      headerName: 'Tickets', field: 'tickets', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'No Access')
          return `<span class='text-danger'>${data.value}</span>`;
        else
          return `<span class='text-success'>${data.value}</span>`;
      }
    },
    {
      headerName: 'Tickets Admin', field: 'ticketsAdmin', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == true)
          return `<i class="far fa-check-circle text-success"></i>`;
        else
          return `<i class="far fa-times-circle text-danger"></i>`;
      }
    },
    {
      headerName: 'Reports', field: 'reports', width: 120, sortable: true, filter: true, resizable: true, cellRenderer: (data) => {
        if (data.value == 'No Access')
          return `<span class='text-danger'>${data.value}</span>`;
        else
          return `<span class='text-success'>${data.value}</span>`;
      }
    },
    { headerName: 'DefaultDashboard', width: 120, field: 'defaultDashboard', sortable: true, filter: true, resizable: true },
    { headerName: 'Created By', width: 120, field: 'createdBy', sortable: true, filter: true, resizable: true },
    { headerName: 'Modified By', width: 120, field: 'modifiedBy', sortable: true, filter: true, resizable: true },
    {
      headerName: 'Created Date', field: 'createddatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'MMM d, yyyy hh:mm a');
      }
    },
    {
      headerName: 'Created Date', field: 'lastupdatedatetime', sortable: true, resizable: true, cellRenderer: (data) => {
        return this.datePipe.transform(data.value, 'MMM d, yyyy hh:mm a');
      }
    }

  ];

  ngOnInit() {
    this.loadRoles();
  }

  loadRoles() {
    this.loading = true;
    this.as.loadRoles().subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.roles = resp['RoleMasters'];
      } else {
        this.snackbar.open('Something went wrong, Try again later.');
      }

    }, error => this.loading = false);
  }

  editRole(event) {
    console.log(event);
    this.role.openCreateModal(event.rowData);
  }

  onRespEvent(role) {
    this.loadRoles();
  }

}
