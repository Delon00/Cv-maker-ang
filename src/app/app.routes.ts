import { Routes } from '@angular/router';

import { authGuard } from '@guards/auth.guard';
import { homeGuard } from '@guards/home.guard';
import { registerGuard } from '@guards/register.guard';
import { AdminGuard } from '@guards/admin.guard';

import { HomeComponent } from '@pages/home/home.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { LoginComponent } from './presentation/pages/auth/login/login.component';
import { RegisterComponent } from './presentation/pages/auth/register/register.component';
import { NotFoundComponent } from './presentation/pages/errors/not-found/not-found.component';
import { AdminComponent } from './presentation/pages/admin/admin.component';
import { TemplatesComponent } from './presentation/pages/templates/templates.component';


export const routes: Routes = [
        { path: '', component: HomeComponent, canActivate: [homeGuard] },

        { path: 'register', component: RegisterComponent, canActivate: [registerGuard] },
        { path: 'login', component: LoginComponent, canActivate: [homeGuard] },
        { path: 'templates', component: TemplatesComponent},

        { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },


        { path: 'admin', component: AdminComponent, canActivate: [AdminGuard], 
                children:[

                ]
        },
        



        { path: '**', component: NotFoundComponent },
];
