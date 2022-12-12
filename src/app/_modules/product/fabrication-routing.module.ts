import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FabricationReportComponent } from 'src/app/_product/fabrication-report/fabrication-report.component';
import { RequestRawMaterialsComponent } from 'src/app/_product/request-raw-materials/request-raw-materials.component';
import { RoleGuardService } from 'src/app/_services/role-guard.service';


const routes: Routes = [
  { path: 'requests-raw-materials', component: RequestRawMaterialsComponent, canActivate: [RoleGuardService] },
  { path: 'report', component: FabricationReportComponent, canActivate: [RoleGuardService] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FabricationRoutingModule { }
