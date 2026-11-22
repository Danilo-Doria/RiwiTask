import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Navbar],
  template: `
    <div class="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <app-navbar />
      <main class="mx-auto w-full max-w-6xl flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <router-outlet />
      </main>
      <footer class="border-t border-slate-200/70 bg-white/60 py-4 text-center text-xs text-slate-500">
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>RiwiTask &copy; {{ currentYear }} · Control y Gestión de Tareas</span>
          <span class="text-slate-400">Diseñado con Angular 22 & Tailwind CSS</span>
        </div>
      </footer>
    </div>
  `,
})
export class MainLayout {
  protected readonly currentYear = new Date().getFullYear();
}
