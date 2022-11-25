import { NgModule } from '@angular/core';
import { ValuesPipe } from './values.pipe';
import { DenormalizePipe } from './denormalize.pipe';
import { SafePipe } from './safe.pipe';
import { SrcConvertPipe } from './src-convert.pipe';
import { NbspPipe } from './nbsp.pipe';
import {PluralPipe} from './plural.pipe';

@NgModule({
    declarations: [ValuesPipe, DenormalizePipe, SafePipe, SrcConvertPipe, NbspPipe, PluralPipe],
    exports: [ValuesPipe, DenormalizePipe, SafePipe, SrcConvertPipe, NbspPipe, PluralPipe]
})
export class PipesModule {}
