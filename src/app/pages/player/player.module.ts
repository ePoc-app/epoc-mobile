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
import {PlayerSettingsPage} from './settings/player-settings.page';
import {AssessmentPage} from './assessment/assessment.page';
import {SimpleChoiceComponent} from './assessment/components/simple-choice/simple-choice.component';
import {MultipleChoiceComponent} from './assessment/components/multiple-choice/multiple-choice.component';
import {ReorderComponent} from './assessment/components/reorder/reorder.component';
import {TranscriptModalPage} from './contents/transcript-modal/transcript-modal.page';
import {DragAndDropComponent} from './assessment/components/drag-and-drop/drag-and-drop.component';
import {SimpleQuestionComponent} from './contents/simple-question/simple-question.component';
import {CourseChoiceComponent} from './contents/course-choice/course-choice.component';
import {SharedModule} from '../../components/shared.module';
import {PipesModule} from '../../pipes/pipes.module';
import {SwipeCardComponent} from './assessment/components/swipe/swipe-card/swipe-card.component';
import {SwipeComponent} from './assessment/components/swipe/swipe.component';
import {ModalPage} from './assessment/components/swipe/swipe-modal/modal-page.component';
import {DropdownListComponent} from './assessment/components/dropdown-list/dropdown-list.component';
import {AbstractActivityContainerComponent} from './assessment/abstract-activity-container.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule.forChild([
        { path: 'play/:id', component: TocEpocPage },
        { path: 'play/:id/:chapter', component: PlayerPage },
        { path: 'play/:id/:chapter/content/:contentId', component: PlayerPage },
        { path: 'play/:id/:chapter/content/:contentId/:next', component: PlayerPage },
        { path: 'about/:id', component: AboutEpocPage },
        { path: 'download/:id', component: DownloadEpocPage },
        { path: 'score/:id', component: ScoreEpocPage },
        { path: 'toc/:id', component: TocEpocPage },
        { path: 'bookmarks/:id', component: BookmarksEpocPage },
        { path: 'settings', component: PlayerSettingsPage },
        { path: 'assessment/:epocId/:assessmentId', component: AssessmentPage },
        { path: '**',   redirectTo: '/' },
    ]),
    PipesModule
  ],
  declarations: [PlayerPage, AboutEpocPage, DownloadEpocPage, ScoreEpocPage, TocEpocPage,
      BookmarksEpocPage, PlayerSettingsPage,
      AssessmentPage, SimpleChoiceComponent, MultipleChoiceComponent, ReorderComponent, DragAndDropComponent,
      TranscriptModalPage, SimpleQuestionComponent, CourseChoiceComponent, SwipeCardComponent, SwipeComponent,
      ModalPage, DropdownListComponent, AbstractActivityContainerComponent],
  entryComponents: [TranscriptModalPage]
})
export class PlayerPageModule {
    constructor() {}
}
