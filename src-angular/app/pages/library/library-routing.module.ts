import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

import {LibraryPage} from './library.page';
import {EpocOverviewPage} from './overview/overview.page';
import {EpocQrPage} from './qr/qr.page';
import {LibraryDetailsPage} from 'src/app/pages/library/details/details.page';

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
    path: ':libraryId',
    component: LibraryDetailsPage
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
