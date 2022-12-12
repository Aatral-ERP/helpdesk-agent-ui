import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VendorRegisterComponent } from 'src/app/vendor-register/vendor-register.component';
import { ViewVendorsComponent } from 'src/app/view-vendors/view-vendors.component';
import { RoleGuardService } from 'src/app/_services/role-guard.service';

const routes: Routes = [
  { path: 'vendor-register', component: VendorRegisterComponent, canActivate: [RoleGuardService] },
  { path: 'view-vendors', component: ViewVendorsComponent, canActivate: [RoleGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendorRoutingModule { }
