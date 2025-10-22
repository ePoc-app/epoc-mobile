import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {LibraryPageRoutingModule} from './library-routing.module';

import {LibraryPage} from './library.page';
import {EpocOverviewPage} from './overview/overview.page';
import {EpocQrPage} from './qr/qr.page';
import {PipesModule} from 'src/app/pipes/pipes.module';
import {SharedModule} from 'src/app/components/shared.module';
import {LibraryDetailsPage} from 'src/app/pages/library/details/details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LibraryPageRoutingModule,
    PipesModule,
    SharedModule,
  ],
  declarations: [LibraryPage, EpocOverviewPage, EpocQrPage, LibraryDetailsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LibraryModule {}
