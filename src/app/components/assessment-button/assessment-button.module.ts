import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {AssessmentButtonComponent} from './assessment-button.component';


@NgModule({
    imports: [
        IonicModule,
        CommonModule
    ],
    declarations: [
        AssessmentButtonComponent
    ],
    exports: [
        AssessmentButtonComponent
    ]
})
export class AssessmentButtonModule { }
