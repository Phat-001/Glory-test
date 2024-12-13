import { Routes } from '@angular/router';
import { HomeComponent } from './layouts/home/home.component';
import { AtmComponent } from './layouts/atm/atm.component';
import { NotFoundComponent } from './layouts/not-found/not-found.component';
import { AtmDetail } from './layouts/atm/atm-detail/atm-detail.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home/atm',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
        children: [
            {
                path: 'atm',
                component: AtmComponent
            },
            {
                path: 'atm/:id',
                component: AtmDetail
            }
        ],
    },
    { path: '**', component: NotFoundComponent }
];
