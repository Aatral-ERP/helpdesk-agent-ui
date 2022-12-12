import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { IncomeExpense } from '../_accounting/income-expense-create/IncomeExpense';
import { AgentLedger } from '../_tickets/agent-ledger/AgentLedger';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  constructor(private http: HttpClient, private auth: AuthService) { }

  getAccountDashboardData() {
    return this.http.post(environment.apiUrl + '/accounts/get-accounting-dashboard-data', null);
  }

  saveIncomeExpense(incomeExpense: IncomeExpense) {
    if (incomeExpense.id == 0) {
      incomeExpense.createdBy = this.auth.getLoginEmailId();
    }
    incomeExpense.modifiedBy = this.auth.getLoginEmailId();
    return this.http.post(environment.apiUrl + '/accounts/save-income-expense', incomeExpense);
  }

  deleteIncomeExpense(incomeExpense: IncomeExpense) {
    return this.http.post(environment.apiUrl + '/accounts/delete-income-expense', incomeExpense);
  }

  getIncomeExpense(incomeExpense: IncomeExpense) {
    return this.http.post(environment.apiUrl + '/accounts/get-income-expense', incomeExpense);
  }

  getIncomeExpenseReport(req) {
    return this.http.post(environment.apiUrl + '/accounts/get-income-expense-report', req);
  }

  loadIncomeExpenseNeeded() {
    return this.http.post(environment.apiUrl + '/accounts/get-income-expense-needed', {});
  }

  getAgentLedger(agent) {
    return this.http.post(environment.apiUrl + '/accounts/get-agent-ledger', agent);
  }

  addLedger(newLedger: AgentLedger) {
    return this.http.post(environment.apiUrl + '/accounts/add-agent-ledger', newLedger);
  }

  uploadLegderProof(photo, ledgerId) {
    let form = new FormData();
    form.append('photo', photo);
    form.append('ledgerId', ledgerId);
    return this.http.post(environment.apiUrl + '/accounts/upload-ledger-proof', form);
  }

  getAccountingReport(req) {
    console.log(req);
    return this.http.post(environment.apiUrl + '/accounts/get-account-report', req);
  }

  loadCategoryNeeded() {
    return this.http.post(environment.apiUrl + '/accounts/get-category-needed', {});
  }

  saveStatementAccount(statement) {
    console.log("Statement_service:", statement);
    let request = {
      "accountStatement": statement
    }
    console.log(request);
    return this.http.post(environment.apiUrl + '/accounts/save-account-statement', request);
  }

  getBankStatementReport(req) {
    console.log(req);
    return this.http.post(environment.apiUrl + '/accounts/get-bank-statement-report', req);
  }

}
