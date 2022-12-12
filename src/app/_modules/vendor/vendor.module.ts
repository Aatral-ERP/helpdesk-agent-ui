import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendorRegisterComponent } from 'src/app/vendor-register/vendor-register.component';
import { ViewVendorsComponent } from 'src/app/view-vendors/view-vendors.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VendorRoutingModule } from './vendor-routing.module';

@NgModule({
  declarations: [
    VendorRegisterComponent, ViewVendorsComponent,],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VendorRoutingModule
  ]
})
export class VendorModule { }
