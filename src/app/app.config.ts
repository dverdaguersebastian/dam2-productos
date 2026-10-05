import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
  ],
};
