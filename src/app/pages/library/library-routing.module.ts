import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibraryPage } from './library.page';
import {EpocOverviewPage} from './overview/overview.page';
import {EpocQrPage} from './qr/qr.page';

const routes: Routes = [
  {
    path: '',
    component: LibraryPage
  },
  {
    path: 'qr',
    component: EpocQrPage
  },
  {
    path: 'local-epocs/:dir',
    component: EpocOverviewPage
  },
  {
    path: ':libraryId/:id',
    component: EpocOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryPageRoutingModule {}
