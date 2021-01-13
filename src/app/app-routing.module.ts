import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuardService} from './services/auth-guard.service';
import {LoginCallbackComponent} from './login/login-callback.component';
import {mode} from '../environments/environment.mode';

const routesDefault: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
    },
    {
        path: 'player',
        loadChildren: () => import('./pages/player/player.module').then(m => m.PlayerPageModule)
    },
    {
        path: 'about',
        loadChildren: () => import('./pages/about/about.module').then(m => m.AboutPageModule)
    },
    {
        path: 'open',
        loadChildren: () => import('./pages/open/open.module').then(m => m.OpenPageModule)
    },
    {path: '**', redirectTo: '/home/default'}
];

const routesInria: Routes = [
    {
        path: 'home',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
    },
    {
        path: 'player',
        canActivate: [AuthGuardService],
        loadChildren: () => import('./pages/player/player.module').then(m => m.PlayerPageModule)
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
    {path: '**', redirectTo: '/home/default'}
];

@NgModule({
    imports: [
        RouterModule.forRoot(mode.inria ? routesInria : routesDefault, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
