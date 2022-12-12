import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { MailService } from 'src/app/_services/mail.service';
import { UtilService } from 'src/app/_services/util.service';
import { MailSettingTestSenderComponent } from '../mail-setting-test-sender/mail-setting-test-sender.component';
import { MailProperties } from './MailProperties';

@Component({
  selector: 'app-mail-setting-properties',
  templateUrl: './mail-setting-properties.component.html',
  styleUrls: ['./mail-setting-properties.component.css']
})
export class MailSettingPropertiesComponent implements OnInit {

  constructor(private mailServ: MailService, private util: UtilService, private snackbar: MatSnackBar, private dialog: MatDialog) { }

  @Input() configFor;
  property: MailProperties;

  saving_update = false;
  loading = false;

  ngOnInit() {
    this.getMailSettingProperties();
  }

  getMailSettingProperties() {
    this.loading = true;
    this.mailServ.getMailSettingProperties(this.configFor).subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.property = resp['MailProperties'];
      }
    }, error => this.loading = false)
  }

  saveSettings() {
    if (this.property.active) {
      if (!this.util.validateEmail(this.property.username)) {
        this.snackbar.open('Email Id is not Valid');
        return;
      } else if (this.property.password === undefined || this.property.password == null || this.property.password == '') {
        this.snackbar.open('Password is not Valid');
        return;
      }
    }
    this.property.configName = this.property.configFor;
    this.saving_update = true;
    this.mailServ.saveMailProperties(this.property).subscribe(resp => {
      this.saving_update = false;
      if (resp['StatusCode'] == '00') {
        this.property = resp['MailProperties'];
        this.snackbar.open('Saved Successfully');
      } else {
        this.snackbar.open('Cannot save Settings, Try later.');
      }
    })
  }

  openMailSenderDialog(configName: string) {
    const dialogRef = this.dialog.open(MailSettingTestSenderComponent, {
      width: window.innerWidth + 'px',
      minHeight: 'calc(100vh - 90px)',
      height: 'auto',
      autoFocus: false,
      disableClose: true,
      data: { configName: configName }
    });
  }

}
