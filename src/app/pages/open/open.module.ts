import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {OpenPage} from './open.page';
import {File} from '@ionic-native/file/ngx';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        RouterModule.forChild([{path: '', component: OpenPage}])
    ],
    declarations: [OpenPage],
    providers: [
        File
    ]
})
export class OpenPageModule {
}
