import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerPage } from './player.page';
import {HideToolbarDirective} from '../../directives/hide-toolbar.directive';
import {AboutEpocPage} from './about-epoc/about-epoc.page';
import {DownloadEpocPage} from './download-epoc/download-epoc.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([
        { path: 'play/:id', component: PlayerPage },
        { path: 'about/:id', component: AboutEpocPage },
        { path: '**',   redirectTo: '/tabs/tab1' }
    ])
  ],
  declarations: [PlayerPage, AboutEpocPage, HideToolbarDirective]
})
export class PlayerPageModule {}
