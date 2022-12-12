import { Component, OnInit } from '@angular/core';
import { AgentService } from 'src/app/_services/agent.service';
import { AuthService } from 'src/app/_services/auth.service';
import { SalesService } from 'src/app/_services/sales.service';
import Swal from 'sweetalert2';
import { DealProjectImplementationComment } from 'src/app/_sales/_entity/deals-project-implementation-comment/DealProjectImplementationComment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { IAngularMyDpOptions, IMyDefaultMonth } from 'angular-mydatepicker';
declare var $: any;

@Component({
  selector: 'app-project-implementations',
  templateUrl: './project-implementations.component.html',
  styleUrls: ['./project-implementations.component.css']
})
export class ProjectImplementationsComponent implements OnInit {

  constructor(private as: AgentService, public auth: AuthService, private ss: SalesService,
    private snackbar: MatSnackBar) {

    let date = new Date().setMonth(new Date().getMonth() - 1);

    this.fromDate = new Date(date);
    this.toDate = new Date();
    this.fromToObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: new Date(date),
        endJsDate: new Date()
      }
    };
  }
  loading = false;
  dpims: Array<any> = [];
  comment = new DealProjectImplementationComment();
  comments: Array<DealProjectImplementationComment> = [];

  savingComment = false;
  loadingComment = false;

  fromDate = null;
  toDate = null;
  fromToObject = null;

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: false
  };

  public defMonth: IMyDefaultMonth = {
    defMonth: ''
  };

  ngOnInit() {
    this.loadProjectImplementations();
  }

  changeDate(month) {
    this.fromDate = new Date(new Date().setMonth(new Date().getMonth() - month));
    this.toDate = new Date();

    this.fromToObject = {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: this.fromDate,
        endJsDate: this.toDate
      }
    };
  }

  loadProjectImplementations() {
    this.loading = true;
    this.as.loadProjectImplementations(this.fromDate, this.toDate).subscribe(resp => {
      this.loading = false;
      this.dpims = resp['DealProjectImplementations'];
    }, error => this.loading = false);
  }

  clearFilters() {
    window.location.reload();
  }

  markasInstallationCompleted(pimp) {
    pimp.installedFinishedBy = this.auth.getLoginEmailId();
    pimp.installedFinishedDateTime = new Date();

    this.savePIM(pimp);
  }

  markasDeliveryCompleted(pimp) {
    pimp.deliveryFinishedBy = this.auth.getLoginEmailId();
    pimp.deliveryFinishedDateTime = new Date();

    this.savePIM(pimp);
  }

  markasManufacturingCompleted(pimp) {
    pimp.manufacturingFinishedBy = this.auth.getLoginEmailId();
    pimp.manufacturingFinishedDateTime = new Date();

    this.savePIM(pimp);
  }

  savePIM(pimp) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You want to Continue.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Continue!'
    }).then((result) => {
      if (result.value) {
        this.loading = true;
        this.ss.saveDealProjectImplementation(pimp).subscribe(resp => {
          this.loading = false;
        }, error => this.loading = false);
      }
    })
  }

  openAddCommentModal(dpim) {
    console.log(dpim);
    this.comment = new DealProjectImplementationComment();

    this.comment.dealId = dpim.dealId;
    this.comment.projectImplemenationId = dpim.id;
    this.comment.commentBy = this.auth.getLoginEmailId();

    if (dpim.status == 'Created') {
      this.comment.commentAtStatus = 'Manufacturing';
    } else if (dpim.status == 'Manufactured') {
      this.comment.commentAtStatus = 'Delivery';
    } else if (dpim.status == 'Delivered') {
      this.comment.commentAtStatus = 'Installation';
    } else if (dpim.status == 'Installed') {
      this.comment.commentAtStatus = 'Completion';
    }
    console.log(this.comment);
    $(function () {
      $('#addCommentModal').appendTo("body").modal('show');
    });
  }

  addComment() {
    this.savingComment = true;
    this.ss.saveDealProjectImplementationComments(this.comment).subscribe(resp => {
      this.savingComment = false;
      if (resp['StatusCode'] == '00') {
        this.comment = new DealProjectImplementationComment();
        this.snackbar.open('Added Successfully');
      }
    }, error => this.savingComment = false)
    $(function () {
      $('#addCommentModal').appendTo("body").modal('hide');
    });
  }


  deleteDealProjectImplementationComments(comment) {
    this.ss.deleteDealProjectImplementationComments(comment).subscribe(resp => {
      if (resp['StatusCode'] == '00') {

        let comment = new DealProjectImplementationComment();
        comment.dealId = comment.dealId;

        this.snackbar.open('Deleted Successfully');
      }
    })
  }


  getAllDealProjectImplementationComments(dpim, atStatus) {
    this.comments = [];
    let comment = new DealProjectImplementationComment();
    comment.dealId = dpim.dealId;
    this.loadingComment = true;

    $(function () {
      $('#showCommentModal').appendTo("body").modal('show');
    });

    this.ss.getAllDealProjectImplementationComments(comment).subscribe(resp => {
      this.loadingComment = false;
      if (resp['StatusCode'] == '00') {
        let comments: Array<DealProjectImplementationComment> = resp['DealProjectImplementationComments'];

        comments
          .filter(comment => comment.commentAtStatus == atStatus)
          .forEach(comment => this.comments.push(comment));

        this.comments.sort((a, b) => b.id - a.id).forEach(cmnt => cmnt.comment = cmnt.comment.replace(/(?:\r\n|\r|\n)/g, '<br>'));
      }
    }, error => this.loadingComment = false);
  }

}
