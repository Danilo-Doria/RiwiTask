import { Component, computed, input } from '@angular/core';

import { Status } from '../../models/enums';
import { STATUS_LABELS } from '../../models/labels';

const STATUS_CONFIG: Record<Status, { container: string; dot: string }> = {
  [Status.PENDIENTE]: {
    container: 'bg-slate-100 text-slate-700 border-slate-200/80',
    dot: 'bg-slate-400',
  },
  [Status.EN_PROCESO]: {
    container: 'bg-sky-50 text-sky-800 border-sky-200/80',
    dot: 'bg-sky-500',
  },
  [Status.COMPLETADA]: {
    container: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    dot: 'bg-emerald-500',
  },
};

@Component({
  selector: 'app-status-badge',
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium"
      [class]="config().container"
    >
      <span class="h-1.5 w-1.5 rounded-full" [class]="config().dot"></span>
      {{ label() }}
    </span>
  `,
})
export class StatusBadge {
  readonly status = input.required<Status>();

  protected readonly label = computed(() => STATUS_LABELS[this.status()]);
  protected readonly config = computed(() => STATUS_CONFIG[this.status()]);
}
