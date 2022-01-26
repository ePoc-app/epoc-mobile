import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SharedModule} from 'src/app/components/shared.module';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {EpocTocPage} from './toc/toc.page';
import {EpocPlayerPage} from './player/player.page';
import {EpocOverviewPage} from './overview/overview.page';
import {EpocScorePage} from './score/score.page';
import {EpocBookmarksPage} from './bookmarks/bookmarks.page';
import {TranscriptModalPage} from './player/contents/transcript-modal/transcript-modal.page';
import {SimpleQuestionComponent} from './player/contents/simple-question/simple-question.component';
import {CourseChoiceComponent} from './player/contents/course-choice/course-choice.component';
import {ChapterInfoComponent} from './player/contents/chapter-info/chapter-info.component';
import {ChapterEndComponent} from './player/contents/chapter-end/chapter-end.component';
import {CommonContentComponent} from './player/contents/common-content/common-content.component';
import {VideoContentComponent} from './player/contents/video/video.component';
import {AssessmentContentComponent} from './player/contents/assessment/assessment.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild([
            {path: ':id', component: EpocOverviewPage},
            {path: 'play/:id', component: EpocTocPage},
            {path: 'play/:id/:chapter', component: EpocPlayerPage},
            {path: 'play/:id/:chapter/content/:contentId', component: EpocPlayerPage},
            {path: 'play/:id/:chapter/content/:contentId/:next', component: EpocPlayerPage},
            {path: 'assessment', loadChildren: () => import('./assessment/assessment.module').then(m => m.AssessmentModule)},
            {path: 'score/:id', component: EpocScorePage},
            {path: 'toc/:id', component: EpocTocPage},
            {path: 'bookmarks/:id', component: EpocBookmarksPage},
            {path: '**', redirectTo: '/'},
        ]),
        PipesModule
    ],
    declarations: [
        EpocPlayerPage,
        EpocOverviewPage,
        EpocScorePage,
        EpocTocPage,
        EpocBookmarksPage,
        TranscriptModalPage,
        SimpleQuestionComponent,
        CourseChoiceComponent,
        ChapterInfoComponent,
        ChapterEndComponent,
        CommonContentComponent,
        VideoContentComponent,
        AssessmentContentComponent
    ],
    entryComponents: [TranscriptModalPage]
})
export class EpocModule {
    constructor() {
    }
}
