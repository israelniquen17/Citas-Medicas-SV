import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; 
bootstrapApplication(App, {
  providers: [
 importProvidersFrom(
      HttpClientModule,
      RouterModule.forRoot(routes) 
    )
  ]
});
