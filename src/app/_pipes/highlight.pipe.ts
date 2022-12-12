import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'highlight' })
export class HighLightPipe implements PipeTransform {
    transform(text: any = '', search: any = ''): string {
        if(text === undefined || search === undefined)
            return text;

        // console.log(text , search);
        try{
            return search ? text.replace(new RegExp(search, 'gi'), `<span class="orange-text text-uppercase"><u>${search}</u></span>`) : text;
        }catch(e){
            console.error(e);
            return text;
        }
        
    }
}