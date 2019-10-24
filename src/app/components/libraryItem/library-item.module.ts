import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LibraryItemComponent} from './library-item.component';
import {IonicModule} from '@ionic/angular';


@NgModule({
    imports: [
        IonicModule,
        CommonModule
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
