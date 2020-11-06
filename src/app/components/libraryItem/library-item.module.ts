import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LibraryItemComponent} from './library-item.component';
import {IonicModule} from '@ionic/angular';
import {PipesModule} from '../../pipes/pipes.module';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        PipesModule
    ],
    declarations: [
        LibraryItemComponent
    ],
    exports: [
        LibraryItemComponent
    ]
})
export class LibraryItemModule {
}
