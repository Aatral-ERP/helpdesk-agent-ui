import { Component, OnInit, HostListener } from '@angular/core';
import { AccountingService } from 'src/app/_services/accounting.service';
import { IAngularMyDpOptions } from 'angular-mydatepicker';

@Component({
  selector: 'app-accounting-dashboard',
  templateUrl: './accounting-dashboard.component.html',
  styleUrls: ['./accounting-dashboard.component.css']
})
export class AccountingDashboardComponent implements OnInit {

  constructor(private acnts: AccountingService) {

    this._search_filters = {
      dateFrom: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      dateTo: new Date(),
      dateObject: {
        isRange: true, singleDate: null, dateRange: {
          beginJsDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
          endJsDate: new Date()
        }
      }
    }
  }

  public myDatePickerOptions: IAngularMyDpOptions = {
    dateRange: true,
    dateFormat: 'dd/mm/yyyy',
    closeSelectorOnDateSelect: true
  };

  currentIncomeExpenseTerm = '';
  incomeExpenseTerms = [];

  _currentIncomeExpenseTermNetProfit = '';
  _income_expense_data = [];
  _last_6months_income_expense_data = [];

  last6MonthsIncome = [];
  last6MonthsExpense = [];
  multi: any[];
  fullpage: any[] = [];
  halfpage: any[] = [window.innerWidth / 2, 300];

  incomes: Array<any> = [];
  expenses: Array<any> = [];
  incomeTotal: number = 0;
  expenseTotal: number = 0;

  colorScheme = {
    domain: ['#2b2be3', '#eb4034']
  };

  _search_filters = {
    dateFrom: null,
    dateTo: null,
    dateObject: {
      isRange: true, singleDate: null, dateRange: {
        beginJsDate: null,
        endJsDate: null
      }
    }
  }

  loading = false;
  ngOnInit() {
    this.loadDashboardData();
    this.getIncomeExpenseReport();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log(event.target.innerWidth);
    this.fullpage = [event.target.innerWidth - 50, 300];
    if (event.target.innerWidth > 767)
      this.halfpage = [event.target.innerWidth / 2, 300];
    else
      this.halfpage = [event.target.innerWidth, 300];
  }

  getIncomeExpenseReport() {
    this.acnts.getIncomeExpenseReport(this._search_filters).subscribe(resp => {
      if (resp['StatusCode'] == '00') {
        this.incomes = resp['Incomes'];
        this.expenses = resp['Expenses'];

        this.incomeTotal = resp['IncomesTotal'];
        this.expenseTotal = resp['ExpensesTotal'];
        
      }
    })
  }

  loadDashboardData() {
    this.loading = true;
    this._income_expense_data = [];
    this.last6MonthsIncome = [];
    this.last6MonthsExpense = [];

    this.acnts.getAccountDashboardData().subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this._income_expense_data = resp['_income_expense_datas'];
        this.last6MonthsIncome = resp['last6MonthsIncome'];
        this.last6MonthsExpense = resp['last6MonthsExpense'];

        if (this._income_expense_data.length > 0) {
          this.currentIncomeExpenseTerm = this._income_expense_data[0].label;
          this.incomeExpenseTerms = [];
          this._income_expense_data.forEach(data => this.incomeExpenseTerms.push(data.label));
          console.log(this.incomeExpenseTerms);
        }

        this.prepareLast6MonthincomeExpense();
      }
    }, error => this.loading = false)

  }

  prepareLast6MonthincomeExpense() {
    this._last_6months_income_expense_data = [];
    this.last6MonthsIncome.forEach(income => {
      let expense = this.last6MonthsExpense.find(exp => exp.name == income.name);
      let data = { name: income.name, series: [{ name: 'Income', value: income.value }, { name: 'Expense', value: expense.value },] }
      this._last_6months_income_expense_data.push(data);
    });
    console.log(this._last_6months_income_expense_data);
  }

  onRespEvent(event) {
    this.getIncomeExpenseReport();
  }

}
