import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ScoreProgressComponent} from './score-progress/score-progress.component';
import {AssessmentButtonComponent} from './assessment-button/assessment-button.component';
import {LibraryItemComponent} from './libraryItem/library-item.component';
import {PipesModule} from '../pipes/pipes.module';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        PipesModule
    ],
    declarations: [
        ScoreProgressComponent,
        AssessmentButtonComponent,
        LibraryItemComponent
    ],
    exports: [
        ScoreProgressComponent,
        AssessmentButtonComponent,
        LibraryItemComponent
    ]
})
export class SharedModule { }
