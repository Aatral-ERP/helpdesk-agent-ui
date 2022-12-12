import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DealsOverviewComponent } from 'src/app/_sales/_entity/deals-overview/deals-overview.component';
import { DealsCreateComponent } from 'src/app/_sales/_entity/deals-create/deals-create.component';
import { DealsComponent } from 'src/app/_sales/_entity/deals/deals.component';
import { RoleGuardService } from 'src/app/_services/role-guard.service';


const routes: Routes = [

  { path: '', component: DealsComponent, canActivate: [RoleGuardService] },
  { path: 'create', component: DealsCreateComponent, canActivate: [RoleGuardService] },
  { path: 'overview/:id', redirectTo: 'overview/:id/deal', canActivate: [RoleGuardService] },
  { path: 'overview/:id/:tab', component: DealsOverviewComponent, canActivate: [RoleGuardService] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealsRoutingModule { }
