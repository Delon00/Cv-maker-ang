import { ApplicationConfig, provideZoneChangeDetection, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { lastValueFrom } from 'rxjs';

// PrimeNG
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

// Routes & Interceptors
import { routes } from './app.routes';
import { authInterceptor } from '@interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';


import { TemplatesService } from '@services/templates.service';
import { UserService } from '@services/user.service';
import { registerAllTemplates } from '@pages/templates/templates.registry';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor])
    ),

    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),

    // --- INITIALISATION AUTH (CRITIQUE) ---
    provideAppInitializer(() => {
        const userService = inject(UserService);
        return lastValueFrom(userService.fetchMe());
    }),

    // --- INITIALISATION TEMPLATES ---
    provideAppInitializer(() => {
        const templatesService = inject(TemplatesService);
        registerAllTemplates(templatesService);
    })
  ],
};