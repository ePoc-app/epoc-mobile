import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routesDefault: Routes = [
    {
        path: 'library',
        loadChildren: () => import('./pages/library/library.module').then(m => m.LibraryModule)
    },
    {
        path: 'epoc',
        loadChildren: () => import('./pages/epoc/epoc.module').then(m => m.EpocModule)
    },
    {
        path: 'about',
        loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
    },
    {path: '**', redirectTo: '/library'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routesDefault, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
