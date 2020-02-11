import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {AssessmentButtonComponent} from './assessment-button.component';
import {RouterModule} from '@angular/router';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        RouterModule
    ],
    declarations: [
        AssessmentButtonComponent
    ],
    exports: [
        AssessmentButtonComponent
    ]
})
export class AssessmentButtonModule { }
