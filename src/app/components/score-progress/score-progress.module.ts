import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ScoreProgressComponent} from './score-progress.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule
    ],
    declarations: [
        ScoreProgressComponent
    ],
    exports: [
        ScoreProgressComponent
    ]
})
export class ScoreProgressModule { }
