import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { PipesModule } from '../../pipes/pipes.module';
import {SharedModule} from '../../components/shared.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: ':id', component: HomePage }]),
    PipesModule,
    SharedModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
