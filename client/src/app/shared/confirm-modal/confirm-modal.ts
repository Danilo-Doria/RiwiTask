import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  host: { '(document:keydown.escape)': 'cancelled.emit()' },
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      (click)="cancelled.emit()"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-100 transition-all duration-200"
        (click)="$event.stopPropagation()"
      >
        <div class="flex items-start gap-4">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-600">
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div class="flex-1">
            <h2 id="confirm-title" class="text-lg font-bold text-slate-900">{{ heading() }}</h2>
            <p class="mt-1.5 text-sm text-slate-600 leading-relaxed">{{ message() }}</p>
          </div>
        </div>

        <div class="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2.5">
          <button
            type="button"
            (click)="cancelled.emit()"
            [disabled]="loading()"
            class="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            (click)="confirmed.emit()"
            [disabled]="loading()"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60 transition cursor-pointer shadow-xs"
          >
            @if (loading()) {
              <svg class="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            }
            {{ loading() ? 'Eliminando...' : confirmLabel() }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmModal {
  readonly heading = input.required<string>();
  readonly message = input.required<string>();
  readonly confirmLabel = input('Eliminar');
  readonly loading = input(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}
