import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeadCreateComponent } from 'src/app/_lead-management/lead-create/lead-create.component';
import { LeadDetailsUploadComponent } from 'src/app/_lead-management/lead-details-upload/lead-details-upload.component';


const routes: Routes = [
  { path: '', component: LeadCreateComponent },
  { path: 'upload', component: LeadDetailsUploadComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeadManagementCreateRoutingModule { }
