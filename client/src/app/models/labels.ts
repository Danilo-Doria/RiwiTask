import { Priority, Status } from './enums';

export const STATUS_LABELS: Record<Status, string> = {
  [Status.PENDIENTE]: 'Pendiente',
  [Status.EN_PROCESO]: 'En proceso',
  [Status.COMPLETADA]: 'Completada',
};

export const PRIORITY_LABELS: Record<Priority, string> = {
  [Priority.BAJA]: 'Baja',
  [Priority.MEDIA]: 'Media',
  [Priority.ALTA]: 'Alta',
};