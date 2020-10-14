import { NgModule } from '@angular/core';
import { ValuesPipe } from './values.pipe';
import { DenormalizePipe } from './denormalize.pipe';

@NgModule({
    declarations: [ValuesPipe, DenormalizePipe],
    exports: [ValuesPipe, DenormalizePipe]
})
export class PipesModule {}
