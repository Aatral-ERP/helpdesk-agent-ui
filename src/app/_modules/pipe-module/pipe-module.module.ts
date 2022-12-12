import { NgModule } from '@angular/core';
import { Base64HTMLPipe } from 'src/app/_pipes/base64-html.pipe';

@NgModule({
  declarations: [Base64HTMLPipe],
  imports: [],
  exports: [Base64HTMLPipe]
})
export class PipeModuleModule { }
