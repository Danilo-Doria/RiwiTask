import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.html',
})
export class TaskList {
  protected readonly authService = inject(AuthService);
}
