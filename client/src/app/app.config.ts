import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
  ],
};

/*
Qué hace provideHttpClient()

Piensa en HttpClient como el “mensajero” de tu app: es el servicio que envía peticiones a tu backend (GET /tasks, POST /auth/login...) y te devuelve las respuestas.

provideHttpClient() registra ese mensajero en el sistema de inyección de dependencias. Sin esto, si intentas hacer inject(HttpClient) en un servicio, Angular lanza un error porque no sabe cómo crearlo.

Fetch vs XHR son dos formas que tiene el navegador de hacer peticiones. XHR es la antigua; fetch es la moderna, más simple y basada en promesas. Angular 22 usa fetch por defecto, por eso ya no necesitas withFetch().

Observables: HttpClient no te devuelve los datos directamente, sino un Observable (de RxJS), que es como un “paquete en camino”. La petición solo se envía cuando alguien se suscribe (con .subscribe() o con el pipe async/toSignal). Lo veremos en los servicios. */