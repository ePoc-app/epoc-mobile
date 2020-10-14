import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'denormalize'
})
export class DenormalizePipe implements PipeTransform {

  transform(value: any, record: any): any {
    // map array of ids with corresponding object values
    if (value && record) {
      return value.map(itemId => {
        const item = record[itemId];
        item.id = itemId;
        return item;
      });
    // map normalized array with corresponding object values
    } else if (value) {
        return Object.entries(value).map((entry: any) => {
            const item = entry[1];
            item.id = entry[0];
            return item;
        });
    }

    return [];
  }

}
