import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerPage } from './player.page';
import {AboutEpocPage} from './about-epoc/about-epoc.page';
import {DownloadEpocPage} from './download-epoc/download-epoc.page';
import {ScoreEpocPage} from './score-epoc/score-epoc.page';
import {TocEpocPage} from './toc-epoc/toc-epoc.page';
import {BookmarksEpocPage} from './bookmarks-epoc/bookmarks-epoc.page';
import {AssessmentButtonModule} from '../../components/assessment-button/assessment-button.module';
import {PlayerSettingsPage} from './settings/player-settings.page';
import {AssessmentPage} from './assessment/assessment.page';
import {SimpleChoiceComponent} from './assessment/components/simple-choice/simple-choice.component';
import { ChartsModule } from 'ng2-charts';
import { Chart } from 'chart.js';
import ChartDoughtnutTextCenter from '../../../assets/js/chart-doughnut-textcenter-plugin.js';
import {MultipleChoiceComponent} from './assessment/components/multiple-choice/multiple-choice.component';
import {ReorderComponent} from './assessment/components/reorder/reorder.component';
import {VideoComponent} from './video/video.component';
import {TranscriptModalPage} from './video/transcript-modal/transcript-modal.page';
import {DragAndDropComponent} from './assessment/components/drag-and-drop/drag-and-drop.component';
import {SimpleQuestionComponent} from './simple-question/simple-question.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    AssessmentButtonModule,
    RouterModule.forChild([
        { path: 'play/:id', component: PlayerPage },
        { path: 'play/:id/content/:contentId', component: PlayerPage },
        { path: 'play/:id/:progress', component: PlayerPage },
        { path: 'about/:id', component: AboutEpocPage },
        { path: 'download/:id', component: DownloadEpocPage },
        { path: 'score/:id', component: ScoreEpocPage },
        { path: 'toc/:id', component: TocEpocPage },
        { path: 'bookmarks/:id', component: BookmarksEpocPage },
        { path: 'settings', component: PlayerSettingsPage },
        { path: 'assessment/:epocId/:assessmentId', component: AssessmentPage },
        { path: '**',   redirectTo: '/tabs/tab1' },
    ]),
    ChartsModule
  ],
  declarations: [PlayerPage, AboutEpocPage, DownloadEpocPage, ScoreEpocPage, TocEpocPage,
      BookmarksEpocPage, PlayerSettingsPage,
      AssessmentPage, SimpleChoiceComponent, MultipleChoiceComponent, ReorderComponent, DragAndDropComponent,
      VideoComponent, TranscriptModalPage, SimpleQuestionComponent],
  entryComponents: [TranscriptModalPage]
})
export class PlayerPageModule {
    constructor() {
        Chart.pluginService.register(ChartDoughtnutTextCenter);
    }
}
