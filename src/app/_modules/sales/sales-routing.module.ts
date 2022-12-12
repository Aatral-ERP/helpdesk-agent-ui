import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesDashboardComponent } from '../../_sales/sales-dashboard/sales-dashboard.component';
import { QuotationsReportComponent } from 'src/app/_sales/_reports/quotations-report/quotations-report.component';
import { PurchaseOrdersReportComponent } from 'src/app/_sales/_reports/purchase-orders-report/purchase-orders-report.component';
import { SalesOrdersReportComponent } from 'src/app/_sales/_reports/sales-orders-report/sales-orders-report.component';
import { ProformaInvoicesReportComponent } from 'src/app/_sales/_reports/proforma-invoices-report/proforma-invoices-report.component';
import { ProjectImplementationsReportsComponent } from 'src/app/_sales/_reports/project-implementations-reports/project-implementations-reports.component';
import { AmcDashboardComponent } from 'src/app/_institute/amc-dashboard/amc-dashboard.component';
import { PaymentsReportComponent } from 'src/app/_sales/_reports/payments-report/payments-report.component';
import { DealsDeliveryChallanReportComponent } from 'src/app/_sales/_entity/deals-delivery-challan-report/deals-delivery-challan-report.component';
import { CreateLetterpadComponent } from 'src/app/_admin/create-letterpad/create-letterpad.component';
import { LetterPadComponent } from 'src/app/_admin/letter-pad/letter-pad/letter-pad.component';

const routes: Routes = [
  { path: '', component: SalesDashboardComponent },
  { path: 'amc-dashboard', component: AmcDashboardComponent },
  { path: 'deals', loadChildren: () => import('./deals/deals.module').then(m => m.DealsModule) },
  { path: 'purchase-inputs', loadChildren: () => import('./purchase-input/purchase-input.module').then(m => m.PurchaseInputModule) },
  { path: 'quotations', component: QuotationsReportComponent },
  { path: 'purchase-orders', component: PurchaseOrdersReportComponent },
  { path: 'project-implementations', component: ProjectImplementationsReportsComponent },
  { path: 'sales-orders', component: SalesOrdersReportComponent },
  { path: 'proforma-invoices', component: ProformaInvoicesReportComponent },
  { path: 'payments', component: PaymentsReportComponent },
  { path: 'invoices', loadChildren: () => import('./invoices/invoices.module').then(m => m.InvoicesModule) },
  { path: 'delivery-challans', component: DealsDeliveryChallanReportComponent },
  
  { path: 'letterpad', component: LetterPadComponent },
  { path: 'letterpad/create-letterpad', component: CreateLetterpadComponent },
  { path: 'settings', loadChildren: () => import('./sales-settings/sales-settings.module').then(m => m.SalesSettingsModule) }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
