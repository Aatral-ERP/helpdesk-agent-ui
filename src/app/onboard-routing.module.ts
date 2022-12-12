import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddContactComponent } from './_onboard/add-contact/add-contact.component';
import { ChangePasswordComponent } from './_onboard/change-password/change-password.component';
import { AuthGuardService } from './_services/auth-guard.service';
import { InstRegisterComponent } from './_onboard/inst-register/inst-register.component';
import { ContactsComponent } from './_onboard/contacts/contacts.component';
import { MyBillsComponent } from './_onboard/my-bills/my-bills.component';
import { PurchaseQuotesComponent } from './_purchase/purchase-quotes/purchase-quotes.component';
import { PurchaseInvoicesComponent } from './_purchase/purchase-invoices/purchase-invoices.component';
import { PurchasePaymentsComponent } from './_purchase/purchase-payments/purchase-payments.component';

const routes: Routes = [
  { path: 'institute-details', component: InstRegisterComponent, canActivate: [AuthGuardService] },
  { path: 'contacts', component: ContactsComponent, canActivate: [AuthGuardService] },
  { path: 'sub-contact', component: AddContactComponent, canActivate: [AuthGuardService] },
  { path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuardService] },
  { path: 'my-bills', component: MyBillsComponent, canActivate: [AuthGuardService] },
  { path: 'purchase-quotes', component: PurchaseQuotesComponent, canActivate: [AuthGuardService] },
  { path: 'purchase-invoices', component: PurchaseInvoicesComponent, canActivate: [AuthGuardService] },
  { path: 'purchase-payments', component: PurchasePaymentsComponent, canActivate: [AuthGuardService] },
  { path: '**', redirectTo: 'institute-details', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardRoutingModule { }
