import { Component, inject } from '@angular/core';
import { Toast, ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  template: `
    <div
      class="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0"
      aria-live="polite"
      aria-atomic="true"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          role="alert"
          class="pointer-events-auto flex items-start gap-3 rounded-xl border p-4 shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-top-2"
          [class.bg-red-50]="toast.type === 'error'"
          [class.border-red-200]="toast.type === 'error'"
          [class.text-red-900]="toast.type === 'error'"
          [class.bg-emerald-50]="toast.type === 'success'"
          [class.border-emerald-200]="toast.type === 'success'"
          [class.text-emerald-900]="toast.type === 'success'"
          [class.bg-amber-50]="toast.type === 'warning'"
          [class.border-amber-200]="toast.type === 'warning'"
          [class.text-amber-900]="toast.type === 'warning'"
          [class.bg-blue-50]="toast.type === 'info'"
          [class.border-blue-200]="toast.type === 'info'"
          [class.text-blue-900]="toast.type === 'info'"
        >
          <!-- Icon -->
          <div class="shrink-0 mt-0.5">
            @switch (toast.type) {
              @case ('error') {
                <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
              }
              @case ('success') {
                <svg class="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                </svg>
              }
              @case ('warning') {
                <svg class="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
              }
              @case ('info') {
                <svg class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
                </svg>
              }
            }
          </div>

          <!-- Message -->
          <div class="flex-1 text-sm font-medium leading-5">
            {{ toast.message }}
          </div>

          <!-- Dismiss Button -->
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="shrink-0 rounded-lg p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
})
export class ToastComponent {
  protected readonly toastService = inject(ToastService);
}
