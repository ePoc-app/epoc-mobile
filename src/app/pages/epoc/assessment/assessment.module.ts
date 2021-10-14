import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {EpocAssessmentPage} from './assessment.page';
import {SimpleChoiceComponent} from './components/simple-choice/simple-choice.component';
import {MultipleChoiceComponent} from './components/multiple-choice/multiple-choice.component';
import {ReorderComponent} from './components/reorder/reorder.component';
import {DragAndDropComponent} from './components/drag-and-drop/drag-and-drop.component';
import {SharedModule} from 'src/app/components/shared.module';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {SwipeCardComponent} from './components/swipe/swipe-card/swipe-card.component';
import {SwipeComponent} from './components/swipe/swipe.component';
import {ModalPage} from './components/swipe/swipe-modal/modal-page.component';
import {DropdownListComponent} from './components/dropdown-list/dropdown-list.component';
import {AbstractActivityContainerComponent} from './abstract-activity-container.component';

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
        EpocAssessmentPage,
        SimpleChoiceComponent,
        MultipleChoiceComponent,
        ReorderComponent,
        DragAndDropComponent,
        SwipeCardComponent,
        SwipeComponent,
        ModalPage,
        DropdownListComponent,
        AbstractActivityContainerComponent
    ]
})
export class AssessmentModule {
    constructor() {
    }
}
