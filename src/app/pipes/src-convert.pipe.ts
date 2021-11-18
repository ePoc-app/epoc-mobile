import {Pipe, PipeTransform} from '@angular/core';
import {EpocService} from '../services/epoc.service';

@Pipe({
    name: 'srcConvert'
})
export class SrcConvertPipe implements PipeTransform {

    constructor(
        public epocService: EpocService
    ) {
    }

    transform(value: string): string {
        const regex = /src=['"](?!http)([^'"]*)['"]/g;
        return value.replace(/assets\/demo\//g, '').replace(regex, `src='${this.epocService.rootFolder}$1'`);
    }

}
