import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimationsAsync(),
        provideClientHydration(),
        provideHttpClient(withFetch()), provideAnimationsAsync(),
        provideRouter(routes),
        provideZoneChangeDetection({ eventCoalescing: true }),
    ]
};
