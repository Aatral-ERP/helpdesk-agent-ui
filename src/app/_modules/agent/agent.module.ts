import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AgentRoutingModule } from './agent-routing.module';
import { MaterialModule } from 'src/app/_modules/material.module';
import { RoleMasterComponent } from 'src/app/_admin/role-master/role-master.component';
import { ButtonRendererComponent } from 'src/app/_admin/role-master/button-renderer.component';
import { RoleCreateModule } from './role-create/role-create.module';
import { AgGridModule } from 'ag-grid-angular';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ViewAgentsComponent } from 'src/app/_onboard/view-agents/view-agents.component';
import { AgentRegisterComponent } from 'src/app/_onboard/agent-register/agent-register.component';
import { FormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';

@NgModule({
  declarations: [ RoleMasterComponent, ViewAgentsComponent,
    AgentRegisterComponent, ButtonRendererComponent],
  imports: [
    RoleCreateModule,
    CommonModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AutocompleteLibModule,
    AgentRoutingModule,
    NgxSkeletonLoaderModule,
    MaterialModule,
    AgGridModule.withComponents([ButtonRendererComponent]),
  ],
  providers: [
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'en-GB' },
  ]
})
export class AgentModule { }
