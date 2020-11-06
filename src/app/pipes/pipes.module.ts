import { NgModule } from '@angular/core';
import { ValuesPipe } from './values.pipe';
import { DenormalizePipe } from './denormalize.pipe';
import { SafePipe } from './safe.pipe';

@NgModule({
    declarations: [ValuesPipe, DenormalizePipe, SafePipe],
    exports: [ValuesPipe, DenormalizePipe, SafePipe]
})
export class PipesModule {}
