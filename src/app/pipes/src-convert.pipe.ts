import {Pipe, PipeTransform} from '@angular/core';
import {LibraryService} from 'src/app/services/library.service';

@Pipe({
    name: 'srcConvert'
})
export class SrcConvertPipe implements PipeTransform {

    constructor(
        public libraryService: LibraryService
    ) {
    }

    transform(value: string): string {
        const regex = /src=['"](?!http)([^'"]*)['"]/g;
        return value.replace(/assets\/demo\//g, '').replace(regex, `src='${this.libraryService.rootFolder}$1'`);
    }

}
