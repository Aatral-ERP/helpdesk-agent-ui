import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IncomeExpense } from './IncomeExpense';
import { AccountingService } from 'src/app/_services/accounting.service';
import { IAngularMyDpOptions } from 'angular-mydatepicker';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
declare var $: any;

@Component({
  selector: 'app-income-expense-create',
  templateUrl: './income-expense-create.component.html',
  styleUrls: ['./income-expense-create.component.css']
})
export class IncomeExpenseCreateComponent implements OnInit {

  constructor(private snackbar: MatSnackBar, private tst: ToastrService, private accServ: AccountingService) { }

  incomeExpense: IncomeExpense = new IncomeExpense();

  _selectedVendor = [];
  _selectedAgents = [];

  _income_category = ['Sales'];
  _expense_category = ['Purchase', 'Salary', 'TA/DA', 'Bonus', 'Miscellaneous', 'Electricity Bill', 'Others'];
  _agents = [];
  _vendors = [];
  @Output('respEvent') respEvent = new EventEmitter();

  saving = false;

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd/mm/yyyy'
  };

  public openCreateModal(incomeExpenseEvent?: IncomeExpense) {
    console.log("Inside openCreateModal", incomeExpenseEvent);

    if (incomeExpenseEvent === undefined) {
      this.incomeExpense = new IncomeExpense();
    } else {
      this.incomeExpense = incomeExpenseEvent;
    }

    $(function () {
      $('#addIncomeExpenseScrollable').appendTo("body").modal('show');
    });
  }

  _vendorDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'vendorName',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  _agentDropdownSettings: IDropdownSettings = {
    singleSelection: true,
    idField: 'emailId',
    textField: 'firstName',
    itemsShowLimit: 1,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  ngOnInit() {
    this.loadIncomeExpenseNeeded();
  }

  loadIncomeExpenseNeeded() {
    this.accServ.loadIncomeExpenseNeeded().subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this._agents = resp['Agents'];
        this._vendors = resp['Vendors'];

        let income_category: Array<string> = resp['IncomeCategorys'];
        let expense_category: Array<string> = resp['ExpenseCategorys'];

        income_category.filter(exp => exp != null).forEach(inc => {
          if (!this._income_category.includes(inc))
            this._income_category.push(inc);
        })

        expense_category.filter(exp => exp != null).forEach(exp => {
          if (!this._expense_category.includes(exp))
            this._expense_category.push(exp);
        })

      }
    })
  }

  getEditModal(id) {
    this.incomeExpense.id = id;
    this.accServ.getIncomeExpense(this.incomeExpense).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.incomeExpense = resp['IncomeExpense'];
        if (this.incomeExpense.paymentDate != null)
          this.incomeExpense.paymentDateObject = { isRange: false, singleDate: { jsDate: new Date(this.incomeExpense.paymentDate) } }
        if (this.incomeExpense.invoiceDate != null)
          this.incomeExpense.invoiceDateObject = { isRange: false, singleDate: { jsDate: new Date(this.incomeExpense.invoiceDate) } }

        if (this.incomeExpense.relatedToAgentId != null && this.incomeExpense.relatedToAgentId != '')
          this._selectedAgents = [this._agents.find(agent => agent.emailId == this.incomeExpense.relatedToAgentId)];
        else
          this._selectedAgents = [];
        if (this.incomeExpense.relatedToSupplierId != null && this.incomeExpense.relatedToSupplierId != '')
          this._selectedVendor = [this._vendors.find(vendor => vendor.id == this.incomeExpense.relatedToSupplierId)];
        else
          this._selectedVendor = [];
        $(function () {
          $('#addIncomeExpenseScrollable').appendTo("body").modal('show');
        });
      } else {
        this.snackbar.open('Something went wrong!');
      }
    }, error => this.snackbar.open('Something went wrong!'))
  }

  saveIncomeExpense() {

    if (isNaN(this.incomeExpense.amount) || this.incomeExpense.amount == 0) {
      this.tst.info('', 'Enter Amount');
      return;
    }

    if (this.incomeExpense.paymentDate == null) {
      this.tst.info('', 'Choose Payment Date');
      return;
    }

    this.saving = true;
    this.accServ.saveIncomeExpense(this.incomeExpense).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Saved Successfully');
        $(function () {
          $('#addIncomeExpenseScrollable').appendTo("body").modal('hide');
        });
        this.respEvent.next(resp['IncomeExpense']);
      } else {
        this.snackbar.open('Something went wrong!');
      }
    });

    if (this.incomeExpense.type == 'Income') {
      if (!this._income_category.includes(this.incomeExpense.category))
        this._income_category.push(this.incomeExpense.category);
    } else if (this.incomeExpense.type == 'Expense') {
      if (!this._expense_category.includes(this.incomeExpense.category))
        this._expense_category.push(this.incomeExpense.category);
    }

  }

  deleteIncomeExpense() {
    this.saving = true;
    this.accServ.deleteIncomeExpense(this.incomeExpense).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.snackbar.open('Deleted Successfully');
        $(function () {
          $('#addIncomeExpenseScrollable').appendTo("body").modal('hide');
        });
        this.respEvent.next('Deleted Successfully');
      } else {
        this.snackbar.open('Something went wrong!');
      }
    })
  }


}
