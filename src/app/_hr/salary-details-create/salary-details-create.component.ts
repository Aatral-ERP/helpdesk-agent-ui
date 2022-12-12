import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { HrService } from 'src/app/_services/hr.service';
import { SalesService } from 'src/app/_services/sales.service';
import Swal from 'sweetalert2';
import { SalaryDetails, SalaryDetailProperty } from '../salary-details/SalaryDetails';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-salary-details-create',
  templateUrl: './salary-details-create.component.html',
  styleUrls: ['./salary-details-create.component.css']
})
export class SalaryDetailsCreateComponent implements OnInit {

  constructor(private ss: SalesService, private hr: HrService, private actRoute: ActivatedRoute,
    private route: Router, private snackbar: MatSnackBar) {

    this.actRoute.queryParams.subscribe(params => {
      console.log(params);
      if (params['edit']) {
        if (params['edit'] == 1 && params['sid']) {
          this._mode = 'Edit';
          this.sd.employeeId = params['sid'];
          this.loadSalaryDetailEdit(params['sid']);
        }
      }
    })
  }

  _selectedAgent = [];
  _mode = 'Create';
  _AgentsDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'employeeId',
    textField: 'firstName',
    itemsShowLimit: 10,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  needed_bankname: Array<String>;
  needed_modeofpayment: Array<String> = ['Bank Transfer', 'Cheque', 'DD', 'Cash', 'Others'];

  _search_filters = {
    agents: [],
  }
  _agents = [];
  keyword = 'name';
  sd = new SalaryDetails();
  saving = false;

  onBankNameChanged(val) {
    this.needed_bankname = this.hr.onBankNameChanged(val);
  }
  ngOnInit() {
    this.loadNeededDetails();
    this.loadNeeded();
  }

  loadNeeded() {
    console.log(":::::NEEDED:::");
    let needed = ['bankname'];
    console.log(":::::NEEDED:::" + needed);
    this.hr.loadNeeded(needed);
  }

  loadNeededDetails() {
    this.ss.getSalesNeededData(['agents']).subscribe(res => {
      console.log(res);
      this._agents = res['Agents'];
      this._agents.forEach(emp => emp.firstName = emp.firstName + ' <' + emp.employeeId + '>');

      if (this.sd.employeeId != '') {
        this._agents
          .filter(emp => emp.employeeId === this.sd.employeeId)
          .forEach(emp => this._selectedAgent = [{ employeeId: this.sd.employeeId, firstName: emp.firstName }]);
      }
    })
  }

  loadSalaryDetailEdit(sid) {
    this.hr.getStaffSalaryDetails(sid).subscribe(res => {
      console.log(res);
      if (res['StatusCode'] == '00') {
        this.sd = res['Salarydetails'];
        this.sd.properties = res['SalaryDetailProperties'];
        this._selectedAgent = [];
        this._selectedAgent.push(this._agents.find(emp => emp.employeeId === this.sd.employeeId));

        console.log(this._selectedAgent);
      }
    })
  }

  saveSalaryDetails() {
    console.log(this.sd);

    if (this.sd.employeeId === undefined || this.sd.employeeId == '' || this.sd.employeeId === null) {
      this.snackbar.open('Select Staff');
      return;
    }

    this.sd.properties.forEach(prop => prop.employeeId = this.sd.employeeId);

    this.sd.totalDeductions = this.getTotalDeductions();
    this.sd.totalEarnings = this.getTotalEarnings();

    if (this.sd.totalDeductions > this.sd.totalEarnings) {
      this.snackbar.open('Deductions Cannot be greater than Earnings');
      return;
    }
    this.sd.netPay = +this.sd.totalEarnings - +this.sd.totalDeductions;


    this.saving = true;
    this.hr.saveSalaryDetails(this.sd).subscribe(res => {
      this.saving = false;
      if (res['StatusCode'] == '00') {
        Swal.fire('', res['StatusDesc'], 'success');
        this.route.navigateByUrl('hr/salary-details');
      }
      else
        Swal.fire('', res['StatusDesc'], 'warning');
    }, error => { this.saving = false; })
  }

  deleteSalaryDetails() {
    if (this.sd.employeeId == null || this.sd.employeeId === undefined || this.sd.employeeId == '') {
      this.snackbar.open('Select Employee');
      return;
    }
    console.log(this.sd);
    this.hr.deleteSalaryDetails(this.sd).subscribe(res => {
      if (res['StatusCode'] == '00') {
        Swal.fire('', res['StatusDesc'], 'success');
        this.route.navigateByUrl('hr/salary-details');
      }
      else
        Swal.fire('', res['StatusDesc'], 'warning');
    })
  }

  addProperty(type: string = 'earning') {
    console.log(type);
    let prop = new SalaryDetailProperty();
    prop.property = '';
    prop.amount = 0;
    prop.propertyType = type;
    console.log(prop);
    this.sd.properties.push(prop);
  }

  public getTotalEarnings(): number {
    let total = 0;
    this.sd.properties.filter(prop => prop.propertyType == 'earning').forEach(prop => {
      total = +total + +prop.amount;
    })
    return total;
  }

  public getTotalDeductions(): number {
    let total = 0;
    this.sd.properties.filter(prop => prop.propertyType == 'deduction').forEach(prop => {
      total = +total + +prop.amount;
    })
    return total;
  }

  clear() {
    window.location.href = "/hr/salary-details-create";
  }

  calculateLOP() {
    this.sd.lopPerDay = Math.round(this.getTotalEarnings() / 30);
  }

}
