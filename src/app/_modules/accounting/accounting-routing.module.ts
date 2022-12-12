import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountingDashboardComponent } from '../../_accounting/accounting-dashboard/accounting-dashboard.component';
import { RoleGuardService } from 'src/app/_services/role-guard.service';
import { StaffExpenseLedgerComponent } from '../../_accounting/staff-expense-ledger/staff-expense-ledger.component';
import { AccountsReportComponent } from 'src/app/_accounting/accounts-report/accounts-report.component';

import { StatementImportComponent } from 'src/app/_accounting/statement-import/statement-import.component';
import { BankaccountStatementSearchComponent } from 'src/app/_accounting/bankaccount-statement-search/bankaccount-statement-search.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: AccountingDashboardComponent, canActivate: [RoleGuardService] },
  { path: 'staff-expense-ledger', component: StaffExpenseLedgerComponent, canActivate: [RoleGuardService] },
  { path: 'accounting_report', component: AccountsReportComponent, canActivate: [RoleGuardService] },
  { path: 'bank_statement_import', component: StatementImportComponent, canActivate: [RoleGuardService] },
  { path: 'bank_statement_search', component: BankaccountStatementSearchComponent, canActivate: [RoleGuardService] },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
