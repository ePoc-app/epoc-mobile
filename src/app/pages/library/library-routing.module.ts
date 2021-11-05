import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LibraryPage } from './library.page';
import {EpocOverviewPage} from './overview/overview.page';

const routes: Routes = [
  {
    path: '',
    component: LibraryPage
  },
  {
    path: ':id',
    component: EpocOverviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LibraryPageRoutingModule {}
