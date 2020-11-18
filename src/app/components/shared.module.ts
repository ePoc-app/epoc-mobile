import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ScoreProgressComponent} from './score-progress/score-progress.component';
import {AssessmentButtonComponent} from './assessment-button/assessment-button.component';
import {LibraryItemComponent} from './libraryItem/library-item.component';
import {PipesModule} from '../pipes/pipes.module';
import {HtmlComponent} from './html/html.component';
import {RouterModule} from '@angular/router';


@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        PipesModule,
        RouterModule
    ],
    declarations: [
        ScoreProgressComponent,
        AssessmentButtonComponent,
        LibraryItemComponent,
        HtmlComponent
    ],
    exports: [
        ScoreProgressComponent,
        AssessmentButtonComponent,
        LibraryItemComponent,
        HtmlComponent
    ]
})
export class SharedModule { }
