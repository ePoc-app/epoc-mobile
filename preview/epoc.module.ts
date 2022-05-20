import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SharedModule} from 'src/app/components/shared.module';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {EpocTocPage} from 'src/app/pages/epoc/toc/toc.page';
import {EpocPlayerPage} from 'src/app/pages/epoc/player/player.page';
import {EpocOverviewPage} from 'src/app/pages/epoc/overview/overview.page';
import {EpocScorePage} from 'src/app/pages/epoc/score/score.page';
import {EpocBookmarksPage} from 'src/app/pages/epoc/bookmarks/bookmarks.page';
import {TranscriptModalPage} from 'src/app/pages/epoc/player/contents/transcript-modal/transcript-modal.page';
import {SimpleQuestionComponent} from 'src/app/pages/epoc/player/contents/simple-question/simple-question.component';
import {CourseChoiceComponent} from 'src/app/pages/epoc/player/contents/course-choice/course-choice.component';
import {ChapterInfoComponent} from 'src/app/pages/epoc/player/contents/chapter-info/chapter-info.component';
import {ChapterEndComponent} from 'src/app/pages/epoc/player/contents/chapter-end/chapter-end.component';
import {CommonContentComponent} from 'src/app/pages/epoc/player/contents/common-content/common-content.component';
import {VideoContentComponent} from 'src/app/pages/epoc/player/contents/video/video.component';
import {AssessmentContentComponent} from 'src/app/pages/epoc/player/contents/assessment/assessment.component';
import {EpocPreviewPage} from 'src/app/pages/epoc/preview/preview.page';
import {PreviewQuestionComponent} from 'src/app/pages/epoc/player/contents/preview-question/preview-question.component';
import {PreviewCorrectionComponent} from 'src/app/pages/epoc/player/contents/preview-question/preview-correction.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild([
            {path: '', component: EpocPreviewPage},
            {path: ':id', component: EpocPreviewPage},
            {path: 'play/:id', component: EpocTocPage},
            {path: 'play/:id/:chapter', component: EpocPlayerPage},
            {path: 'play/:id/:chapter/content/:contentId', component: EpocPlayerPage},
            {path: 'play/:id/:chapter/content/:contentId/:next', component: EpocPlayerPage},
            {path: 'assessment', loadChildren: () => import('src/app/pages/epoc/assessment/assessment.module').then(m => m.AssessmentModule)},
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
        AssessmentContentComponent,
        EpocPreviewPage,
        PreviewQuestionComponent,
        PreviewCorrectionComponent
    ],
    entryComponents: [TranscriptModalPage]
})
export class EpocModule {
    constructor() {
    }
}
