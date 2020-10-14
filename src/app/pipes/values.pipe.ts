import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'values'
})
export class ValuesPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return !value ? [] : Object.values(value);
  }

}
