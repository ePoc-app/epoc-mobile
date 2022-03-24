import { NgModule } from '@angular/core';
import { ValuesPipe } from './values.pipe';
import { DenormalizePipe } from './denormalize.pipe';
import { SafePipe } from './safe.pipe';
import { SrcConvertPipe } from './src-convert.pipe';
import { NbspPipe } from './nbsp.pipe';

@NgModule({
    declarations: [ValuesPipe, DenormalizePipe, SafePipe, SrcConvertPipe, NbspPipe],
    exports: [ValuesPipe, DenormalizePipe, SafePipe, SrcConvertPipe, NbspPipe]
})
export class PipesModule {}
