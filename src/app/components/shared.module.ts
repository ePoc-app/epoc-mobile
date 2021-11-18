import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ScoreProgressComponent} from './score-progress/score-progress.component';
import {AssessmentButtonComponent} from './assessment-button/assessment-button.component';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {HtmlComponent} from './html/html.component';
import {RouterModule} from '@angular/router';
import {VideoPlayerComponent} from './video-player/video-player.component';


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
        HtmlComponent,
        VideoPlayerComponent
    ],
    exports: [
        ScoreProgressComponent,
        AssessmentButtonComponent,
        HtmlComponent,
        VideoPlayerComponent
    ]
})
export class SharedModule { }
