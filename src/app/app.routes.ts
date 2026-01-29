import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';
import { adminGuard } from '@guards/admin.guard';
import { guestGuard } from '@guards/guest.guard';

export const routes: Routes = [
  // --- ZONE PUBLIQUE ---
    { path: '', loadComponent: () => import('@pages/home/home.component').then(m => m.HomeComponent)},
    { path: 'templates', loadComponent: () => import('@pages/templates/templates.component').then(m => m.TemplatesComponent) },
    { path: 'simple', loadComponent: () => import('@pages/templates/cvs/simple/simple.component').then(m => m.SimpleComponent) },

    // --- ZONE INVITÉ (Login/Register) ---
    {path: '',canActivate: [guestGuard],
        children: [
            { path: 'login', loadComponent: () => import('@pages/auth/login/login.component').then(m => m.LoginComponent) },
            { path: 'register', loadComponent: () => import('@pages/auth/register/register.component').then(m => m.RegisterComponent) },
        ]
    },

    // --- ZONE MEMBRE ---
    {path: '',canActivate: [authGuard],
        children: [
            { path: 'profil', loadComponent: () => import('@pages/dashboard/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'cv-editor/:templateId', loadComponent: () => import('@pages/cv-editor/cv-editor.component').then(m => m.CvEditorComponent) },
        ]
    },

    // --- ZONE ADMIN ---
    {path: 'admin',canActivate: [adminGuard],loadComponent: () => import('@pages/admin/admin.component').then(m => m.AdminComponent),
        children: [
            { path: 'users', loadComponent: () => import('./presentation/pages/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent) }
        ]
    },

    // --- WILDCARD ---
    { 
        path: '**', 
        loadComponent: () => import('@pages/errors/not-found/not-found.component').then(m => m.NotFoundComponent) 
    },
];