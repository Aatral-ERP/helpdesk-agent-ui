import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FabricationRoutingModule } from './fabrication-routing.module';
import { FabricationReportComponent } from '../../_product/fabrication-report/fabrication-report.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { FormsModule } from '@angular/forms';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AgGridModule } from 'ag-grid-angular';
import { AgGridButtonRendererModule } from '../common/ag-grid-button-renderer.module';
import { AGGridButtonRendererComponent } from '../common/ag-grid-button-renderer.component';


@NgModule({
  declarations: [FabricationReportComponent],
  imports: [
    CommonModule,
    FabricationRoutingModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    AngularMyDatePickerModule,
    NgxSkeletonLoaderModule,
    AgGridModule.withComponents([AGGridButtonRendererComponent]),
    AgGridButtonRendererModule
  ]
})
export class FabricationModule { }
