import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LibraryPageRoutingModule } from './library-routing.module';

import { LibraryPage } from './library.page';
import {EpocOverviewPage} from './overview/overview.page';
import {PipesModule} from '../../pipes/pipes.module';
import {SharedModule} from '../../components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibraryPageRoutingModule,
    PipesModule,
    SharedModule,
  ],
  declarations: [LibraryPage, EpocOverviewPage]
})
export class LibraryModule {}
