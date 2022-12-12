import { Component, Input, OnInit } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { MailService } from "src/app/_services/mail.service";
import { UtilService } from "src/app/_services/util.service";
import { MailProperties } from "../mail-setting-properties/MailProperties";
import { MailSettingTestSenderComponent } from "../mail-setting-test-sender/mail-setting-test-sender.component";
declare var $: any;

@Component({
  selector: "app-mail-setting-properties-lead",
  templateUrl: "./mail-setting-properties-lead.component.html",
  styleUrls: ["./mail-setting-properties-lead.component.css"],
})
export class MailSettingPropertiesLeadComponent implements OnInit {

  constructor(private mailServ: MailService, private util: UtilService, private snackbar: MatSnackBar, private dialog: MatDialog) { }

  @Input() configFor;
  property: MailProperties;
  leadProperties: Array<MailProperties>;

  addProperty: MailProperties;

  saving_update = false;
  sending_test_mail = false;
  error_msg = "";
  loading = false;

  ngOnInit() {
    this.getMailSettingProperties();
  }

  addLeadMailSettingModalOpen(mailProperty?: MailProperties) {
    if (mailProperty === undefined) {
      mailProperty = new MailProperties();
      mailProperty.active = true;
      mailProperty.configFor = 'Leads';
      mailProperty.username = '';
      mailProperty.host = '';
      mailProperty.password = '';
      mailProperty.port = 587;
      mailProperty.protocol = 'smtp';
    }

    this.addProperty = Object.assign({}, mailProperty);
    $(function () {
      $('#add_lead_mail_setting_modal').appendTo("body").modal('show');
    });
  }

  getMailSettingProperties() {
    this.loading = true;
    this.mailServ.getMailSettingProperties(this.configFor).subscribe(
      (resp) => {
        this.loading = false;
        if (resp["StatusCode"] == "00") {
          this.leadProperties = resp["MailProperties"];
          this.property = this.leadProperties.find(prop => prop.configName == 'Leads');
        } else {
          this.snackbar.open('Cannot load Mail properties for ' + this.configFor);
        }
      },
      (error) => (this.loading = false)
    );
  }

  saveSettings() {
    this.property.configName = 'Leads';
    if (this.property.active) {
      if (!this.util.validateEmail(this.property.username)) {
        this.snackbar.open("Email Id is not Valid");
        return;
      } else if (
        this.property.password === undefined ||
        this.property.password == null ||
        this.property.password == ""
      ) {
        this.snackbar.open("Password is not Valid");
        return;
      }
    }

    this.mailServ.saveMailProperties(this.property).subscribe((resp) => {
      if (resp["StatusCode"] == "00") {
        this.property = resp["MailProperties"];
        this.snackbar.open("Saved Successfully " + this.property.configFor);
      } else {
        this.snackbar.open("Cannot save Settings, Try later.");
      }
    });
  }

  deleteMailProperties(property: MailProperties) {
    this.snackbar.open("Deleting.... " + property.configName);
    this.mailServ.deleteMailProperty(property).subscribe((resp) => {
      if (resp["StatusCode"] == "00") {
        let index = this.leadProperties.findIndex(prop => prop.id == property.id);
        this.leadProperties.splice(index, 1);
        this.snackbar.open("Deleted Successfully " + property.configName);
      } else {
        this.snackbar.open("Cannot delete Settings, Try later.");
      }
    });
  }

  saveLeadAdditionalmailSettings() {
    if (this.addProperty.active) {
      if (!this.util.validateEmail(this.addProperty.username)) {
        this.snackbar.open("Email Id is not Valid");
        return;
      } else if (this.addProperty.configName == 'Leads') {
        this.snackbar.open("Mail Setting Name can't be 'Leads', Please change to some other name");
        return;
      } else if (this.addProperty.password === undefined || this.addProperty.password == null || this.addProperty.password == "") {
        this.snackbar.open("Password is not Valid");
        return;
      }
    }

    this.saving_update = true;
    this.mailServ.saveMailProperties(this.addProperty).subscribe((resp) => {
      this.saving_update = false;
      if (resp["StatusCode"] == "00") {
        this.addProperty = resp["MailProperties"];
        let index = this.leadProperties.findIndex(prop => prop.id == this.addProperty.id);
        if (index > 0) {
          this.leadProperties[index] = this.addProperty;
        } else {
          this.leadProperties.push(this.addProperty);
        }

        this.snackbar.open("Saved Successfully " + this.addProperty.configName);
        this.addProperty = undefined;
        $(function () {
          $('#add_lead_mail_setting_modal').modal('hide');
        });

      } else {
        this.snackbar.open("Cannot save Settings, Try later.");
      }
    });
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
