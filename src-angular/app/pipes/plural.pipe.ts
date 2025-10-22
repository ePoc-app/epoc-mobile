import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'plural',
    pure: false
})

export class PluralPipe implements PipeTransform {
    transform(key: string, count: number): string {
        return `${key}.${count <= 1 ? 'singular' : 'plural'}`;
    }
}