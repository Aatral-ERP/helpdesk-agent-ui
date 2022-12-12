import { Component, OnInit } from '@angular/core';
import { AccountingService } from 'src/app/_services/accounting.service';
import { IncomeExpense } from 'src/app/_accounting/income-expense-create/IncomeExpense';

@Component({
  selector: 'app-agent-expenses',
  templateUrl: './agent-expenses.component.html',
  styleUrls: ['./agent-expenses.component.css']
})
export class AgentExpensesComponent implements OnInit {

  constructor(private accServ: AccountingService) { }

  loading = false;
  ngOnInit() {
    this.getAgentExpenses();
  }

  expenses: Array<IncomeExpense> = [];

  getAgentExpenses() {
    this.loading = true;
    this.accServ.getAgentExpenses().subscribe(resp => {
      this.loading = false;
      if (resp['StatusCode'] == '00') {
        this.expenses = resp['Expenses'];
      }
    }, error => this.loading = false);
  }

}
