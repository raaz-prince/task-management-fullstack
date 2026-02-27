import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Task } from '../../models/task/task-response.model';
import { TaskStatus } from '../../models/task-status';

@Component({
  selector: 'app-task-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-modal.html',
  styleUrl: './task-modal.css',
})
export class TaskModal implements OnChanges {

  @Input() task!: Task;
  @Input() isEditing = false;

  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Task>();
  @Output() cancelEdit = new EventEmitter<void>();
  @Output() save = new EventEmitter<Task>();

  TaskStatus = TaskStatus;

  editableTask!: Task;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      // Create shallow copy to prevent direct mutation
      this.editableTask = { ...this.task };
    }
  }

  getStatusClasses(status: TaskStatus) {
    return {
      'bg-blue-50 text-blue-700': status === TaskStatus.TO_DO,
      'bg-yellow-50 text-yellow-700': status === TaskStatus.IN_PROGRESS,
      'bg-green-50 text-green-700': status === TaskStatus.COMPLETED
    };
  }

  get todayISO(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}