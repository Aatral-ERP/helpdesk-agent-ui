import { Pipe, PipeTransform } from '@angular/core';
import { Base64 } from 'js-base64';

@Pipe({
  name: 'base64HTML'
})
export class Base64HTMLPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {

    try {
      return Base64.decode(value);
    } catch (err) {
      console.log(err);
      return value;
    }
  }

}
