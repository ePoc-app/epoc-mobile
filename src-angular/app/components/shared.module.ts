import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {ScoreProgressComponent} from './score-progress/score-progress.component';
import {AssessmentButtonComponent} from './assessment-button/assessment-button.component';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {HtmlComponent} from './html/html.component';
import {RouterModule} from '@angular/router';
import {VideoPlayerComponent} from './video-player/video-player.component';
import {CardComponent} from './card/card.component';
import {FlipCardComponent} from './flip-card/flip-card.component';
import {SimpleChoiceComponent} from './questions/simple-choice/simple-choice.component';
import {MultipleChoiceComponent} from './questions/multiple-choice/multiple-choice.component';
import {ReorderComponent} from './questions/reorder/reorder.component';
import {DragAndDropComponent} from './questions/drag-and-drop/drag-and-drop.component';
import {SwipeComponent} from './questions/swipe/swipe.component';
import {DropdownListComponent} from './questions/dropdown-list/dropdown-list.component';
import {AbstractQuestionComponent} from './questions/abstract-question.component';
import {CommonQuestionComponent} from './questions/common-question/common-question.component';
import {ThoughtsComponent} from './questions/thoughts/thoughts.component';
import {CorrectionSimpleChoiceComponent} from './corrections/correction-simple-choice/correction-simple-choice.component';
import {CorrectionMultipleChoiceComponent} from './corrections/correction-multiple-choice/correction-multiple-choice.component';
import {CorrectionSortComponent} from './corrections/correction-sort/correction-sort.component';
import {CorrectionGenericComponent} from './corrections/correction-generic/correction-generic.component';
import {CorrectionReorderComponent} from './corrections/correction-reorder/correction-reorder.component';
import {DebugComponent} from './debug/debug.component';
import {CertificateModalComponent} from './certificate-modal/certificate-modal.component';
import {TranslateModule} from '@ngx-translate/core';
import {AudioPlayerComponent} from './audio-player/audio-player.component';
import {BadgeComponent} from 'src/app/components/badge/badge.component';
import {BadgeModalComponent} from 'src/app/components/badge-modal/badge-modal.component';
import {CustomQuestionComponent} from 'src/app/components/questions/custom-question/custom-question.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        PipesModule,
        RouterModule,
        TranslateModule
    ],
    declarations: [
        ScoreProgressComponent,
        AssessmentButtonComponent,
        HtmlComponent,
        VideoPlayerComponent,
        AudioPlayerComponent,
        CardComponent,
        FlipCardComponent,
        SimpleChoiceComponent,
        MultipleChoiceComponent,
        ReorderComponent,
        DragAndDropComponent,
        SwipeComponent,
        DropdownListComponent,
        AbstractQuestionComponent,
        CommonQuestionComponent,
        ThoughtsComponent,
        CorrectionSimpleChoiceComponent,
        CorrectionMultipleChoiceComponent,
        CorrectionSortComponent,
        CorrectionGenericComponent,
        CorrectionReorderComponent,
        DebugComponent,
        CertificateModalComponent,
        BadgeComponent,
        BadgeModalComponent,
        CustomQuestionComponent
    ],
    exports: [
        ScoreProgressComponent,
        AssessmentButtonComponent,
        HtmlComponent,
        VideoPlayerComponent,
        AudioPlayerComponent,
        CardComponent,
        FlipCardComponent,
        SimpleChoiceComponent,
        MultipleChoiceComponent,
        ReorderComponent,
        DragAndDropComponent,
        SwipeComponent,
        DropdownListComponent,
        AbstractQuestionComponent,
        CommonQuestionComponent,
        ThoughtsComponent,
        CorrectionSimpleChoiceComponent,
        CorrectionMultipleChoiceComponent,
        CorrectionSortComponent,
        CorrectionGenericComponent,
        CorrectionReorderComponent,
        DebugComponent,
        CertificateModalComponent,
        TranslateModule,
        BadgeComponent,
        BadgeModalComponent
    ]
})
export class SharedModule { }
