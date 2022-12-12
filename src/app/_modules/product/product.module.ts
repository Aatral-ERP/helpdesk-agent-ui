import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { ViewProductsComponent } from '../../_product/view-products/view-products.component';
import { AddProductComponent } from '../../_product/add-product/add-product.component';
import { ProductRoutingModule } from './product-routing.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { AgGridModule } from 'ag-grid-angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AgGridButtonRendererModule } from '../common/ag-grid-button-renderer.module';
import { AGGridButtonRendererComponent } from '../common/ag-grid-button-renderer.component';
import { RequestRawMaterialsComponent } from '../../_product/request-raw-materials/request-raw-materials.component';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { StockReportComponent } from 'src/app/_product/stock-report/stock-report.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { StockEntryComponent } from '../../_product/stock-entry/stock-entry.component';

@NgModule({
  declarations: [ViewProductsComponent, AddProductComponent, RequestRawMaterialsComponent, StockReportComponent, StockEntryComponent],
  imports: [
    CommonModule,
    ProductRoutingModule,
    FormsModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    AngularEditorModule,
    NgMultiSelectDropDownModule,
    AngularMyDatePickerModule,
    AutocompleteLibModule,
    AgGridModule.withComponents([AGGridButtonRendererComponent]),
    AgGridButtonRendererModule
  ], providers: [DecimalPipe],
  entryComponents: [AddProductComponent]
})
export class ProductModule { }
