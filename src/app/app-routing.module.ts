import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuardService} from './services/auth-guard.service';
import {LoginCallbackComponent} from './login/login-callback.component';
import {mode} from 'src/environments/environment.mode';

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
        path: 'open',
        loadChildren: () => import('./pages/open/open.module').then(m => m.OpenPageModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
    },
    {path: '**', redirectTo: '/library'}
];

const routesInria: Routes = [
    {
        path: 'library',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./pages/library/library.module').then(m => m.LibraryModule)
    },
    {
        path: 'epoc',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./pages/epoc/epoc.module').then(m => m.EpocModule)
    },
    {
        path: 'about',
        loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'login/:error',
        component: LoginComponent
    },
    {
        path: 'callback',
        component: LoginCallbackComponent
    },
    {
        path: 'open',
        loadChildren: () => import('./pages/open/open.module').then(m => m.OpenPageModule)
    },
    {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsPageModule)
    },
    {path: '**', redirectTo: '/library'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(mode === 'inria' ? routesInria : routesDefault, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
