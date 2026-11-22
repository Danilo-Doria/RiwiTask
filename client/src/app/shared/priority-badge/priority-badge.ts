import { Component, computed, input } from '@angular/core';

import { Priority } from '../../models/enums';
import { PRIORITY_LABELS } from '../../models/labels';

const PRIORITY_CONFIG: Record<Priority, { container: string; bar: string }> = {
  [Priority.BAJA]: {
    container: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    bar: 'bg-emerald-500',
  },
  [Priority.MEDIA]: {
    container: 'bg-amber-50 text-amber-800 border-amber-200/80',
    bar: 'bg-amber-500',
  },
  [Priority.ALTA]: {
    container: 'bg-rose-50 text-rose-800 border-rose-200/80',
    bar: 'bg-rose-500',
  },
};

@Component({
  selector: 'app-priority-badge',
  template: `
    <span
      class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium"
      [class]="config().container"
    >
      <span class="h-1.5 w-1.5 rounded-full" [class]="config().bar"></span>
      {{ label() }}
    </span>
  `,
})
export class PriorityBadge {
  readonly priority = input.required<Priority>();

  protected readonly label = computed(() => PRIORITY_LABELS[this.priority()]);
  protected readonly config = computed(() => PRIORITY_CONFIG[this.priority()]);
}
