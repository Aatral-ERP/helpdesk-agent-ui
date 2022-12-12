import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingDashboardComponent } from '../../_accounting/accounting-dashboard/accounting-dashboard.component';
import { MaterialModule } from '../material.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { IncomeExpenseCreateComponent } from '../../_accounting/income-expense-create/income-expense-create.component';
import { FormsModule } from '@angular/forms';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular';
import { StaffExpenseLedgerComponent } from '../../_accounting/staff-expense-ledger/staff-expense-ledger.component';
import { AgGridButtonRendererModule } from '../common/ag-grid-button-renderer.module';
import { StaffExpenseButtonRendererComponent } from 'src/app/_accounting/staff-expense-ledger/staff-expense-button-renderer.component';
import { AccountsReportComponent } from 'src/app/_accounting/accounts-report/accounts-report.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PipeModuleModule } from '../pipe-module/pipe-module.module';
import { AGGridButtonRendererComponent } from '../common/ag-grid-button-renderer.component';

import { StatementImportComponent } from '../../_accounting/statement-import/statement-import.component';
import { BankaccountStatementSearchComponent } from '../../_accounting/bankaccount-statement-search/bankaccount-statement-search.component';

@NgModule({
  declarations: [AccountingDashboardComponent, IncomeExpenseCreateComponent,
    StaffExpenseLedgerComponent, StaffExpenseButtonRendererComponent, AccountsReportComponent,StatementImportComponent, BankaccountStatementSearchComponent],
  imports: [
    CommonModule,
    FormsModule,
    AgGridButtonRendererModule,
    NgMultiSelectDropDownModule,
    AccountingRoutingModule,
    MaterialModule,
    AgGridModule.withComponents([AGGridButtonRendererComponent]),
    AgGridButtonRendererModule,
    AngularMyDatePickerModule,
    AutocompleteLibModule,
    NgxChartsModule, NgxSkeletonLoaderModule, AgGridModule, PipeModuleModule]
})
export class AccountingModule { }
