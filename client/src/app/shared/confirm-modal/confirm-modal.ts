import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  host: { '(document:keydown.escape)': 'cancelled.emit()' },
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      (click)="cancelled.emit()"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        (click)="$event.stopPropagation()"
      >
        <h2 id="confirm-title" class="text-lg font-bold text-slate-900">{{ heading() }}</h2>
        <p class="mt-2 text-sm text-slate-600">{{ message() }}</p>

        <div class="mt-6 flex justify-end gap-3">
          <button
            type="button"
            (click)="cancelled.emit()"
            [disabled]="loading()"
            class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            (click)="confirmed.emit()"
            [disabled]="loading()"
            class="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
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
  readonly confirmLabel = input('Eliminar'); // input con valor por defecto
  readonly loading = input(false);

  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
}