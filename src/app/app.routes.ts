import { Routes } from '@angular/router';

// Guards
import { authGuard } from '@guards/auth.guard';
import { adminGuard } from '@guards/admin.guard';
import { guestGuard } from '@guards/guest.guard'; // On garde que celui-ci pour le public

// Components
import { HomeComponent } from '@pages/home/home.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { LoginComponent } from '@pages/auth/login/login.component';
import { RegisterComponent } from '@pages/auth/register/register.component';
import { NotFoundComponent } from '@pages/errors/not-found/not-found.component';
import { AdminComponent } from '@pages/admin/admin.component';
import { TemplatesComponent } from '@pages/templates/templates.component';
import { CvEditorComponent } from '@pages/cv-editor/cv-editor.component';
import { SimpleComponent } from '@pages/templates/cvs/simple/simple.component';

export const routes: Routes = [
    // ----------------------------------------------------------------
    // 1. ZONE PUBLIQUE (Accessible par tout le monde)
    // ----------------------------------------------------------------
    // Note : Le guestGuard ici signifie "Si connecté, redirige vers Dashboard".
    // Si tu veux que la Home soit accessible même connecté (Landing Page), retire le guestGuard.
    { path: '', component: HomeComponent, canActivate: [guestGuard] },
    
    { path: 'templates', component: TemplatesComponent },
    { path: 'simple', component: SimpleComponent },

    // ----------------------------------------------------------------
    // 2. ZONE INVITÉ (Login/Register accessible UNIQUEMENT si NON connecté)
    // ----------------------------------------------------------------
    {
        path: '',
        canActivate: [guestGuard], // Bloque l'accès si déjà connecté
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ]
    },

    // ----------------------------------------------------------------
    // 3. ZONE MEMBRE (Accessible UNIQUEMENT si connecté)
    // ----------------------------------------------------------------
    {
        path: '',
        canActivate: [authGuard], // Bloque l'accès si pas connecté
        children: [
            { path: 'profil', component: DashboardComponent }, 
            { path: 'cv-editor/:templateId', component: CvEditorComponent },
        ]
    },

    // ----------------------------------------------------------------
    // 4. ZONE ADMIN
    // ----------------------------------------------------------------
    { 
        path: 'admin', 
        component: AdminComponent, 
        canActivate: [authGuard, adminGuard], // Double sécurité
        children: [
            // { path: 'users', component: AdminUsersComponent }
        ]
    },

    // ----------------------------------------------------------------
    // 5. WILDCARD
    // ----------------------------------------------------------------
    { path: '**', component: NotFoundComponent },
];