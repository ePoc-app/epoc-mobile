import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerPage } from './player.page';
import {HideToolbarDirective} from '../../directives/hide-toolbar.directive';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: PlayerPage }])
  ],
  declarations: [PlayerPage, HideToolbarDirective]
})
export class PlayerPageModule {}
