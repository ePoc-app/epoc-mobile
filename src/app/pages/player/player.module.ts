import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerPage } from './player.page';
import {HideToolbarDirective} from '../../directives/hide-toolbar.directive';
import {AboutEpocPage} from './about-epoc/about-epoc.page';
import {DownloadEpocPage} from './download-epoc/download-epoc.page';
import {ScoreEpocPage} from './score-epoc/score-epoc.page';
import {TocEpocPage} from './toc-epoc/toc-epoc.page';
import {BookmarksEpocPage} from './bookmarks-epoc/bookmarks-epoc.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        { path: 'play/:id', component: PlayerPage },
        { path: 'play/:id/:page', component: PlayerPage },
        { path: 'about/:id', component: AboutEpocPage },
        { path: 'download/:id', component: DownloadEpocPage },
        { path: 'score/:id', component: ScoreEpocPage },
        { path: 'toc/:id', component: TocEpocPage },
        { path: 'bookmarks/:id', component: BookmarksEpocPage },
        { path: '**',   redirectTo: '/tabs/tab1' }
    ])
  ],
  declarations: [PlayerPage, AboutEpocPage, DownloadEpocPage, ScoreEpocPage, TocEpocPage, BookmarksEpocPage, HideToolbarDirective]
})
export class PlayerPageModule {}
