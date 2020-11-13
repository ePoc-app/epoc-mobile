import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home/:id',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'player',
    loadChildren: () =>
        import('./pages/player/player.module').then(m => m.PlayerPageModule)
  },
  {
    path: 'about',
    loadChildren: () =>
        import('./pages/about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'open',
    loadChildren: () =>
        import('./pages/open/open.module').then(m => m.OpenPageModule)
  },
  { path: '**', redirectTo: 'open' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
