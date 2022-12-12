import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillCreateComponent } from 'src/app/_sales/purchase-input/bill-create/bill-create.component';
import { BillsComponent } from 'src/app/_sales/purchase-input/bills/bills.component';
import { BillOverviewComponent } from 'src/app/_sales/purchase-input/bill-overview/bill-overview.component';
import { PurchaseInputOrderCreateComponent } from '../../../_sales/purchase-input/purchase-input-order-create/purchase-input-order-create.component';
import { PurchaseInputOrdersComponent } from 'src/app/_sales/purchase-input/purchase-input-orders/purchase-input-orders.component';
import { PurchaseInputOrderOverviewComponent } from 'src/app/_sales/purchase-input/purchase-input-order-overview/purchase-input-order-overview.component';
import { RoleGuardService } from 'src/app/_services/role-guard.service';
import { BillPaymentReportComponent } from 'src/app/_sales/purchase-input/bill-payment-report/bill-payment-report.component';


const routes: Routes = [
  { path: 'bills', component: BillsComponent, canActivate: [RoleGuardService] },
  { path: 'bills/create', component: BillCreateComponent, canActivate: [RoleGuardService] },
  { path: 'bills/overview/:id', component: BillOverviewComponent, canActivate: [RoleGuardService] },
  { path: 'orders', component: PurchaseInputOrdersComponent, canActivate: [RoleGuardService] },
  { path: 'orders/create', component: PurchaseInputOrderCreateComponent, canActivate: [RoleGuardService] },
  { path: 'orders/overview/:id', component: PurchaseInputOrderOverviewComponent, canActivate: [RoleGuardService] },
  { path: 'bill-payment', component: BillPaymentReportComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseInputRoutingModule { }
