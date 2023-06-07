import {IonicModule} from '@ionic/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from 'src/app/components/shared.module';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {SimpleQuestionComponent} from './contents/simple-question/simple-question.component';
import {CourseChoiceComponent} from './contents/course-choice/course-choice.component';
import {ChapterInfoComponent} from './contents/chapter-info/chapter-info.component';
import {ChapterEndComponent} from './contents/chapter-end/chapter-end.component';
import {CommonContentComponent} from './contents/common-content/common-content.component';
import {VideoContentComponent} from './contents/video/video.component';
import {AssessmentContentComponent} from './contents/assessment/assessment.component';
import {PreviewQuestionComponent} from './contents/preview-question/preview-question.component';
import {PreviewCorrectionComponent} from './contents/preview-question/preview-correction.component';
import {TranscriptModalPage} from './contents/transcript-modal/transcript-modal.page';
import {AudioContentComponent} from './contents/audio/audio.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule,
        PipesModule,
    ],
    declarations: [
        SimpleQuestionComponent,
        CourseChoiceComponent,
        ChapterInfoComponent,
        ChapterEndComponent,
        CommonContentComponent,
        VideoContentComponent,
        AudioContentComponent,
        AssessmentContentComponent,
        PreviewQuestionComponent,
        PreviewCorrectionComponent,
        TranscriptModalPage,
    ],
    exports: [
        SimpleQuestionComponent,
        CourseChoiceComponent,
        ChapterInfoComponent,
        ChapterEndComponent,
        CommonContentComponent,
        VideoContentComponent,
        AudioContentComponent,
        AssessmentContentComponent,
        PreviewQuestionComponent,
        PreviewCorrectionComponent,
        TranscriptModalPage,
    ],
    entryComponents: [TranscriptModalPage]
})
export class PlayerModule {
    constructor() {
    }
}
