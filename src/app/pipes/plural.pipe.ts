import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "plural",
    pure: false
})

export class PluralPipe implements PipeTransform {
    transform(key: string, number: number): string {
        return `${key}.${number == 1 ? "singular" : "plural"}`;
    }
}