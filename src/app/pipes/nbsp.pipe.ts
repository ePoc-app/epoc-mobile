import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nbsp'
})
export class NbspPipe implements PipeTransform {

  transform(value: string): string {
    return value ? value.replace(/\s([?:;!])/g, '\xa0$1') : value;
  }

}
