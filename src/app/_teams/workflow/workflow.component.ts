import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Teams } from '../teams/Teams';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material';
import { TeamsService } from 'src/app/_services/teams.service';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private ts: TeamsService) {

  }

  @Input() team: Teams = new Teams();
  @Output() workflowChangeEmitter: EventEmitter<string> = new EventEmitter();

  loading = false;
  name: string;
  newWorkflow = '';
  afterItem = 'To Do';
  deleteItem = '';
  deleteConfirmItem = '';

  ngOnInit() {
    console.log(this.team);
    if (this.team.workflows != null && this.team.workflows != '') {
      console.log(this.team.workflows);
      let workflows = Array.from(this.team.workflows.split(';'));

      workflows.forEach(status => {
        if (status != 'To Do' && status != 'Done' && status.length != 0) {
          this.items.push(status);
        }
      })
    }
  }

  items: Array<string> = [];

  drop(event: CdkDragDrop<string[]>) {
    console.log(event);
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
    console.log(this.items);
    this.saveTeamWorkFlow();
  }

  openAddWorkflowModal() {
    $(function () {
      $('#openAddWorkflowModalId').appendTo("body").modal('show');
    });
  }

  addWorkflowStatus() {

    if (this.newWorkflow == 'To Do' || this.newWorkflow == 'Done' || this.items.find(item => item.toLowerCase() == this.newWorkflow.toLowerCase()) !== undefined) {
      this.snackbar.open('Status already exists');
      return;
    }
    let _items = [];
    if (this.afterItem == 'To Do') {
      _items.push(this.newWorkflow.trim());

      this.items = _items.concat(this.items);

      console.log(this.items);
    } else {
      this.items.forEach(item => {
        _items.push(item);
        if (item == this.afterItem) {
          _items.push(this.newWorkflow.trim());
        }
      })
      this.items = _items;
    }
    $(function () {
      $('#openAddWorkflowModalId').appendTo("body").modal('hide');
    });

    this.afterItem = this.newWorkflow;
    this.newWorkflow = '';
    console.log(this.items);
    this.saveTeamWorkFlow();
  }

  saveTeamWorkFlow() {

    let workflow = '';

    workflow = 'To Do;';
    this.items.forEach(item => workflow = workflow + item + ';');
    workflow = workflow + 'Done;';

    console.log(workflow);

    let _team_temp: Teams = Object.assign({}, this.team);

    _team_temp.workflows = workflow;
    this.snackbar.open('Updating Workflows');
    this.loading = true;
    this.ts.saveTeam(_team_temp).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Workflows Updated');
        this.team.workflows = resp['Team']['workflows'];
        this.workflowChangeEmitter.next(this.team.workflows);
      } else {
        if (this.team.workflows != null && this.team.workflows != '') {
          let workflows = Array.from(this.team.workflows.split(';'));

          workflows.forEach(status => {
            if (status != 'To Do' && status != 'Done') {
              this.items.push(status);
            }
          })
        } else {
          this.items = [];
        }
      }
    }, error => this.loading = false)
  }

  openDeleteStatusModal(item) {
    this.deleteItem = item;
    $(function () {
      $('#deleteWorkflowStatusModalId').appendTo("body").modal('show');
    });
  }

  confirmDelete() {

    let deleteItemIndex = this.items.indexOf(this.deleteItem);

    if (deleteItemIndex !== -1) {

      this.items.splice(deleteItemIndex, 1);

      $(function () {
        $('#deleteWorkflowStatusModalId').appendTo("body").modal('hide');
      });

      this.saveTeamWorkFlow();

    }
    console.log(this.items);
  }

}

