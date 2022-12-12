import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MailService } from 'src/app/_services/mail.service';
import { UtilService } from 'src/app/_services/util.service';
import { TaskCreateComponent } from 'src/app/_teams/task-create/task-create.component';

@Component({
  selector: 'app-mail-setting-test-sender',
  templateUrl: './mail-setting-test-sender.component.html',
  styleUrls: ['./mail-setting-test-sender.component.css']
})
export class MailSettingTestSenderComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TaskCreateComponent>, public util: UtilService,
    @Inject(MAT_DIALOG_DATA) public data: any, private mailService: MailService) { }

  configName: string = '';
  mailTo: string = '';

  sending_test_mail = false;
  error_msg = "";
  success_msg = "";

  ngOnInit() {
    console.log(this.data);
    this.configName = this.data.configName;
  }

  sendTestMail() {
    console.log(this.configName, this.mailTo)
    if (!this.util.validateEmail(this.mailTo)) {
      this.error_msg = "Please enter valid email-id";
      return;
    }

    this.error_msg = ""; this.success_msg = "";
    this.sending_test_mail = true;
    this.mailService.sendTestMail(this.configName, this.mailTo).subscribe(resp => {
      console.log(resp);
      this.sending_test_mail = false;
      this.success_msg = 'Sent Successfully';
    }, error => {
      console.log(error);
      this.sending_test_mail = false;
      this.error_msg = error.error.message;
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
