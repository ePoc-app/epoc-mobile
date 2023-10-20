import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {SharedModule} from 'src/app/components/shared.module';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {EpocTocPage} from './toc/toc.page';
import {EpocPlayerPage} from './player/player.page';
import {EpocScorePage} from './score/score.page';
import {EpocBookmarksPage} from './bookmarks/bookmarks.page';
import {PlayerModule} from './player/player.module';
import {EpocPreviewPage} from './preview/preview.page';
import {EpocPreviewEditorPage} from './preview-editor/preview-editor.page';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        SharedModule,
        RouterModule.forChild([
            {path: 'play/:id', component: EpocTocPage},
            {path: 'play/:id/:chapter', component: EpocPlayerPage},
            {path: 'play/:id/:chapter/content/:contentId', component: EpocPlayerPage},
            {path: 'play/:id/:chapter/content/:contentId/:next', component: EpocPlayerPage},
            {path: 'assessment', loadChildren: () => import('./assessment/assessment.module').then(m => m.AssessmentModule)},
            {path: 'score/:id', component: EpocScorePage},
            {path: 'toc/:id', component: EpocTocPage},
            {path: 'bookmarks/:id', component: EpocBookmarksPage},
            {path: 'preview/:id', component: EpocPreviewPage},
            {path: 'preview-editor/:id', component: EpocPreviewEditorPage},
            {path: '**', redirectTo: '/'},
        ]),
        PipesModule,
        PlayerModule
    ],
    declarations: [
        EpocPlayerPage,
        EpocScorePage,
        EpocTocPage,
        EpocBookmarksPage,
        EpocPreviewPage,
        EpocPreviewEditorPage
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EpocModule {
    constructor() {
    }
}
