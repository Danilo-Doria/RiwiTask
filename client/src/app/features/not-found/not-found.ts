import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <main class="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4 text-center">
      <p class="text-6xl font-bold text-indigo-600">404</p>
      <h1 class="mt-4 text-2xl font-bold text-slate-900">Página no encontrada</h1>
      <p class="mt-2 text-slate-600">La dirección que buscas no existe o fue movida.</p>
      <a
        routerLink="/tasks"
        class="mt-6 rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-indigo-700 cursor-pointer"
      >
        Volver al inicio
      </a>
    </main>
  `,
})
export class NotFound {}