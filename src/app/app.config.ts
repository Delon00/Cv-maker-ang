import { ApplicationConfig, inject, importProvidersFrom } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { authInterceptor } from '@interceptors/auth.interceptor';
import { TemplatesService } from '@services/templates.service';
import { registerAllTemplates } from '@pages/templates/templates.registry';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),
    provideAnimationsAsync(),
    providePrimeNG({ theme: { preset: Aura } }),
    {
      provide: TemplatesService,
      useFactory: () => {
        const templatesService = new TemplatesService();
        registerAllTemplates(templatesService);
        return templatesService;
      }
    }
  ],
};
