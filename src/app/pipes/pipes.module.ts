import { NgModule } from '@angular/core';
import { ValuesPipe } from './values.pipe';
import { DenormalizePipe } from './denormalize.pipe';
import { SafePipe } from './safe.pipe';
import { SrcConvertPipe } from './src-convert.pipe';

@NgModule({
    declarations: [ValuesPipe, DenormalizePipe, SafePipe, SrcConvertPipe],
    exports: [ValuesPipe, DenormalizePipe, SafePipe, SrcConvertPipe]
})
export class PipesModule {}
