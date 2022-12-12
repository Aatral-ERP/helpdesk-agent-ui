import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleCreateComponent } from 'src/app/_admin/role-create/role-create.component';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [RoleCreateComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ], exports: [RoleCreateComponent]
})
export class RoleCreateModule { }
