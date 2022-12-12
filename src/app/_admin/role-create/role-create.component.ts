import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RoleMaster } from './RoleMaster';
import { AgentService } from 'src/app/_services/agent.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Agent } from 'src/app/_profile/agent-profile/Agent';
declare var $: any;

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrls: ['./role-create.component.css']
})
export class RoleCreateComponent implements OnInit {

  constructor(private as: AgentService, private snackbar: MatSnackBar) { }

  role: RoleMaster = new RoleMaster();

  @Output('respEvent') respEvent = new EventEmitter();

  saving = false;

  public openCreateModal(roleEvent?: RoleMaster) {
    console.log("Inside openCreateModal", roleEvent);

    if (roleEvent === undefined) {
      this.role = new RoleMaster();
    } else {
      this.role = roleEvent;
    }

    $(function () {
      $('#addRoleScrollable').appendTo("body").modal('show');
    });
  }

  ngOnInit() {
  }

  saveRole() {
    this.saving = true;

    if (this.role.name === undefined || this.role.name == null || this.role.name == '') {
      alert('Please enter Role Name');
      return;
    }

    this.as.saveRole(this.role).subscribe(resp => {
      this.saving = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Saved Successfully');
        $(function () {
          $('#addRoleScrollable').appendTo("body").modal('hide');
        });
        this.respEvent.next(resp['RoleMaster']);
      } else {
        this.snackbar.open('Something went wrong!');
      }

    }, error => this.saving = false)
  }

  deleteRole() {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete this Role.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete!'
    }).then((result) => {
      if (result.value) {

        this.as.deleteRole(this.role).subscribe(resp => {
          if (resp['StatusCode'] == '00') {
            $(function () {
              $('#addRoleScrollable').appendTo("body").modal('hide');
            });
            this.respEvent.next(resp['RoleMaster']);
            this.snackbar.open('Deleted Successfully');
          } else if (resp['StatusCode'] == '03') {
            this.showAssociatedAgents(resp['Agents'], resp['StatusDesc']);
          } else {
            alert('Something went wrong');
          }
        })

      }
    })
  }

  showAssociatedAgents(agents: Array<Agent>, response: string) {

    let agents_text = "";
    agents.forEach(agent => {
      agents_text = agents_text + agent.firstName + " " + agent.lastName + "<br>";
    })

    Swal.fire({
      title: response,
      html: agents_text,
      icon: 'info',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ok'
    })
  }



}
