import { Routes } from '@angular/router';

import { authGuard } from '@guards/auth.guard';
import { homeGuard } from '@guards/home.guard';
import { registerGuard } from '@guards/register.guard';
import { AdminGuard } from '@guards/admin.guard';

import { HomeComponent } from '@pages/home/home.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { LoginComponent } from '@pages/auth/login/login.component';
import { RegisterComponent } from '@pages/auth/register/register.component';
import { NotFoundComponent } from '@pages/errors/not-found/not-found.component';
import { AdminComponent } from '@pages/admin/admin.component';
import { TemplatesComponent } from '@pages/templates/templates.component';
import { SimpleComponent } from '@pages/templates/cvs/simple/simple.component';
import { CvEditorComponent } from '@pages/cv-editor/cv-editor.component';



export const routes: Routes = [
        { path: '', component: HomeComponent, canActivate: [homeGuard] },

        { path: 'register', component: RegisterComponent, canActivate: [registerGuard] },
        { path: 'login', component: LoginComponent, canActivate: [homeGuard] },

        { path: 'templates', component: TemplatesComponent},
        { path: 'cv-editor/:templateId',component: CvEditorComponent},
        { path: 'simple', component: SimpleComponent},

        { path: 'mes_cvs', component: DashboardComponent, canActivate: [authGuard] },


        { path: 'admin', component: AdminComponent, canActivate: [AdminGuard], 
                children:[

                ]
        },
        



        { path: '**', component: NotFoundComponent },
];
