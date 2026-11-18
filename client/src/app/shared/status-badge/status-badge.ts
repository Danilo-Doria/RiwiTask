import { Component, computed, input } from '@angular/core';

import { Status } from '../../models/enums';
import { STATUS_LABELS } from '../../models/labels';

const STATUS_CLASSES: Record<Status, string> = {
  [Status.PENDIENTE]: 'bg-slate-100 text-slate-700',
  [Status.EN_PROCESO]: 'bg-blue-100 text-blue-700',
  [Status.COMPLETADA]: 'bg-green-100 text-green-700',
};

@Component({
  selector: 'app-status-badge',
  template: `
    <span
      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      [class]="classes()"
    >
      {{ label() }}
    </span>
  `,
})
export class StatusBadge {
  readonly status = input.required<Status>();

  protected readonly label = computed(() => STATUS_LABELS[this.status()]);
  protected readonly classes = computed(() => STATUS_CLASSES[this.status()]);
}