import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DealProjectImplementation } from './DealProjectImplementation';
import { SalesService } from 'src/app/_services/sales.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/_services/auth.service';
import Swal from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';
import { DealProjectImplementationComment } from '../deals-project-implementation-comment/DealProjectImplementationComment';
declare var $: any;

@Component({
  selector: 'app-deals-project-implementation',
  templateUrl: './deals-project-implementation.component.html',
  styleUrls: ['./deals-project-implementation.component.css']
})
export class DealsProjectImplementationComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private ss: SalesService, public auth: AuthService) { }

  @ViewChild('stepper', { static: false }) stepper: MatStepper;

  pimp: DealProjectImplementation = new DealProjectImplementation();

  @Input("dealId") dealId: number;
  loading = false;
  agentName = '';
  comment = '';
  callback = '';
  tab = 0;
  currentStageNumber = 0;
  _agents = [];
  savingComment = false;

  comments: Array<DealProjectImplementationComment> = [];

  ngOnInit() {
    this.getDealProjectImplementation();
  }

  getDealProjectImplementation() {
    this.loading = true;
    this.ss.getDealProjectImplementation(this.dealId).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        if (resp['DealProjectImplementation'] != null) {
          this.pimp = resp['DealProjectImplementation'];
          this.prepareTabIndex();
          this.getAllDealProjectImplementationComments();
        }
      }
    }, error => this.loading = false);
  }

  prepareTabIndex() {

    this.stepper.linear = false;
    this.tab = 0;
    this.currentStageNumber = 0;
    if (this.pimp.status == 'Created') {
      this.tab = 0;
      this.stepper.selectedIndex = this.tab + 1;
    } else if (this.pimp.status == 'Manufactured') {
      this.tab = 1;
      this.stepper.selectedIndex = this.tab + 1;
    } else if (this.pimp.status == 'Delivered') {
      this.tab = 2;
      this.stepper.selectedIndex = this.tab + 1;
    } else if (this.pimp.status == 'Installed') {
      this.tab = 3;
      this.stepper.selectedIndex = this.tab + 1;
    } else if (this.pimp.status == 'Completed') {
      this.tab = 4;
      this.stepper.selectedIndex = this.tab;
    }
    this.stepper.linear = true;
    this.currentStageNumber = this.tab + 1;
  }

  createPIM() {
    this.pimp.dealId = this.dealId;
    this.pimp.status = 'Created';

    this.savePIM();
  }

  savePIM() {
    this.pimp.dealId = this.dealId;

    this.loading = true;
    this.ss.saveDealProjectImplementation(this.pimp).subscribe(resp => {
      this.loading = false;
      this.pimp = resp['DealProjectImplementation'];
      this.prepareTabIndex();

      $(function () {
        $('#agentaddmodal').appendTo("body").modal('hide');
      });
    }, error => this.loading = false);
  }

  openAddCommentModal() {
    $(function () {
      $('#addCommentModal').appendTo("body").modal('show');
    });
  }

  openAgentModal(callback) {

    if (this._agents.length == 0) {
      this.ss.getSalesNeededData(['agents']).subscribe(res => {
        console.log(res);
        this._agents = res['Agents'];
      });
    }
    this.callback = callback;
    $(function () {
      $('#agentaddmodal').appendTo("body").modal('show');
    });
  }

  callBackSaveProjectImplementation(agent) {
    console.log(this.callback);
    if (this.callback == 'assignManufacturingToAgent') {
      this.assignManufacturingToAgent(agent.emailId);
    } else if (this.callback == 'assignDeliveryToAgent') {
      this.assignDeliveryToAgent(agent.emailId);
    } else if (this.callback == 'assignInstallationToAgent') {
      this.assignInstallationToAgent(agent.emailId);
    } else if (this.callback == 'markasManufacturingCompleted') {
      this.markasManufacturingCompleted(agent.emailId);
    } else if (this.callback == 'markasDeliveryCompleted') {
      this.markasDeliveryCompleted(agent.emailId);
    } else if (this.callback == 'markasInstallationCompleted') {
      this.markasInstallationCompleted(agent.emailId);
    }

  }

  markasInstallationCompleted(emailId) {
    this.pimp.installedFinishedBy = emailId;
    this.pimp.installedFinishedDateTime = new Date();
    this.pimp.mailAction = 'markasInstallationCompleted';

    console.log(this.pimp);
    this.savePIM();
  }

  markasDeliveryCompleted(emailId) {
    this.pimp.deliveryFinishedBy = emailId;
    this.pimp.deliveryFinishedDateTime = new Date();
    this.pimp.mailAction = 'markasDeliveryCompleted';

    console.log(this.pimp);
    this.savePIM();
  }

  markasManufacturingCompleted(emailId) {
    this.pimp.manufacturingFinishedBy = emailId;
    this.pimp.manufacturingFinishedDateTime = new Date();
    this.pimp.mailAction = 'markasManufacturingCompleted';

    console.log(this.pimp);
    this.savePIM();
  }

  assignManufacturingToAgent(emailId) {
    this.pimp.manufacturingAgent = emailId;
    this.pimp.manufacturingAssignedBy = this.auth.getLoginEmailId();
    this.pimp.manufacturingAssignedDateTime = new Date();
    this.pimp.mailAction = 'assignManufacturingToAgent';

    console.log(this.pimp);

    this.savePIM();
  }

  assignDeliveryToAgent(emailId) {
    this.pimp.deliveryAgent = emailId;
    this.pimp.deliveryAssignedBy = this.auth.getLoginEmailId();
    this.pimp.deliveryAssignedDateTime = new Date();
    this.pimp.mailAction = 'assignDeliveryToAgent';

    console.log(this.pimp);
    this.savePIM();
  }

  assignInstallationToAgent(emailId) {
    this.pimp.installedAgent = emailId;
    this.pimp.installedAssignedBy = this.auth.getLoginEmailId();
    this.pimp.installedAssignedDateTime = new Date();
    this.pimp.mailAction = 'assignInstallationToAgent';

    console.log(this.pimp);
    this.savePIM();
  }

  approveManufacturing() {

    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Approve Manufacturing.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update!'
    }).then((result) => {
      if (result.value) {
        this.pimp.status = 'Manufactured';
        this.pimp.manufacturingApprovedBy = this.auth.getLoginEmailId();
        this.pimp.manufacturingApprovedDateTime = new Date();
        this.pimp.mailAction = 'approveManufacturing';

        this.savePIM();
      }
    })

  }

  approveDelivery() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Approve Delivery.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update!'
    }).then((result) => {
      if (result.value) {
        this.pimp.status = 'Delivered';
        this.pimp.deliveryApprovedBy = this.auth.getLoginEmailId();
        this.pimp.deliveryApprovedDateTime = new Date();
        this.pimp.mailAction = 'approveDelivery';

        this.savePIM();
      }
    })
  }

  approveInstalled() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Approve Installation.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update!'
    }).then((result) => {
      if (result.value) {
        this.pimp.status = 'Installed';
        this.pimp.installedApprovedBy = this.auth.getLoginEmailId();
        this.pimp.installedApprovedDateTime = new Date();
        this.pimp.mailAction = 'approveInstalled';

        this.savePIM();
      }
    })
  }

  markAsCompleted() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Mark Project Implementation Completed.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Update!'
    }).then((result) => {
      if (result.value) {

        this.pimp.status = 'Completed';
        this.pimp.workCompletionBy = this.auth.getLoginEmailId();
        this.pimp.workCompletionDateTime = new Date();

        this.savePIM();
      }
    })
  }

  addComment() {
    this.savingComment = true;
    let comment = new DealProjectImplementationComment();
    comment.comment = this.comment;
    comment.dealId = this.dealId;
    comment.projectImplemenationId = this.pimp.id;
    comment.commentBy = this.auth.getLoginEmailId();

    if (this.pimp.status == 'Created') {
      comment.commentAtStatus = 'Manufacturing';
    } else if (this.pimp.status == 'Manufactured') {
      comment.commentAtStatus = 'Delivery';
    } else if (this.pimp.status == 'Delivered') {
      comment.commentAtStatus = 'Installation';
    } else if (this.pimp.status == 'Installed') {
      comment.commentAtStatus = 'Completion';
    }

    this.savingComment = true;
    this.ss.saveDealProjectImplementationComments(comment).subscribe(resp => {
      this.savingComment = false;
      if (resp['StatusCode'] == '00') {
        this.comment = '';
        this.snackbar.open('Added Successfully');
        this.getAllDealProjectImplementationComments();
      }
    }, error => this.savingComment = false)
    $(function () {
      $('#addCommentModal').appendTo("body").modal('hide');
    });
  }

  deleteDealProjectImplementationComments(comment) {
    this.ss.deleteDealProjectImplementationComments(comment).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.getAllDealProjectImplementationComments();
        this.snackbar.open('Deleted Successfully');
      }
    })
  }

  getAllDealProjectImplementationComments() {
    let comment = new DealProjectImplementationComment();
    comment.dealId = this.dealId;
    this.ss.getAllDealProjectImplementationComments(comment).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.comments = resp['DealProjectImplementationComments'];
        this.comments.sort((a, b) => b.id - a.id).forEach(cmnt => cmnt.comment = cmnt.comment.replace(/(?:\r\n|\r|\n)/g, '<br>'));
      }
    })
  }

}
