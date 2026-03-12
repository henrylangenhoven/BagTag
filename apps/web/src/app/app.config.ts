import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ApiConfiguration } from './generated/bagtag-api/api-configuration';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: ApiConfiguration,
      useFactory: (): ApiConfiguration => {
        const configuration = new ApiConfiguration();
        configuration.rootUrl = '';
        return configuration;
      },
    },
  ],
};
