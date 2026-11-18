import { Component, computed, input } from '@angular/core';

import { Priority } from '../../models/enums';
import { PRIORITY_LABELS } from '../../models/labels';

const PRIORITY_CLASSES: Record<Priority, string> = {
  [Priority.BAJA]: 'bg-green-100 text-green-700',
  [Priority.MEDIA]: 'bg-yellow-100 text-yellow-800',
  [Priority.ALTA]: 'bg-red-100 text-red-700',
};

@Component({
  selector: 'app-priority-badge',
  template: `
    <span
      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
      [class]="classes()"
    >
      {{ label() }}
    </span>
  `,
})
export class PriorityBadge {
  readonly priority = input.required<Priority>();

  protected readonly label = computed(() => PRIORITY_LABELS[this.priority()]);
  protected readonly classes = computed(() => PRIORITY_CLASSES[this.priority()]);
}