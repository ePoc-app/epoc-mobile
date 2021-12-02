import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {EpocAssessmentPage} from './assessment.page';
import {SharedModule} from 'src/app/components/shared.module';
import {PipesModule} from 'src/app/pipes/pipes.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild([
            {path: ':epocId/:assessmentId', component: EpocAssessmentPage},
            {path: '**', redirectTo: '/'},
        ]),
        PipesModule
    ],
    declarations: [
        EpocAssessmentPage
    ]
})
export class AssessmentModule {
    constructor() {
    }
}
