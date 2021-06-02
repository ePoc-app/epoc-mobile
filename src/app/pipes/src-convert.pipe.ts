import {Pipe, PipeTransform} from '@angular/core';
import {LibraryService} from '../services/library.service';

@Pipe({
    name: 'srcConvert'
})
export class SrcConvertPipe implements PipeTransform {

    constructor(
        public libraryService: LibraryService
    ) {
    }

    transform(value: string): string {
        const regex = /src=['"]([^'"]*)['"]/g;
        return value.replace(regex, `src='${this.libraryService.rootFolder}$1'`).replace(/assets\/demo/g, '');
    }

}
