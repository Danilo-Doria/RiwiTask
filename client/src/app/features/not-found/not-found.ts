import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <main class="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-16 text-center">
      <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-xs mb-4">
        <svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <p class="text-5xl font-extrabold tracking-tight text-indigo-600 sm:text-6xl">404</p>
      <h1 class="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Página no encontrada</h1>
      <p class="mt-2 max-w-md text-sm text-slate-500 leading-relaxed">
        La dirección que intentas visitar no existe, cambió de ubicación o no tienes permisos para visualizarla.
      </p>

      <div class="mt-8">
        <a
          routerLink="/tasks"
          class="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Volver al inicio</span>
        </a>
      </div>
    </main>
  `,
})
export class NotFound {}
