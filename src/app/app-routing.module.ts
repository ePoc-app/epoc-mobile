import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
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
  { path: '**', redirectTo: '' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
