import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskStatus } from '../../models/task-status';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.html',
  styleUrl: './task-card.css',
})
export class TaskCard {

  TaskStatus = TaskStatus;
  statuses = Object.values(TaskStatus);

  @Input() task: any;

  @Output() deleteTask = new EventEmitter<number>();
  @Output() statusChange = new EventEmitter<{ id: number, status: TaskStatus}>();

  showDropdown = false;

  constructor(private elementRef: ElementRef){}

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  onDelete() {
    this.deleteTask.emit(this.task.id);
  }

  changeStatus(status: TaskStatus) {
    this.statusChange.emit({
      id: this.task.id,
      status: status
    });
    this.showDropdown = false;
  }

   getStatusClasses(status: TaskStatus) {
    return {
      'bg-blue-50 text-blue-700 hover:bg-blue-100':
        status === TaskStatus.TO_DO,

      'bg-yellow-50 text-yellow-700 hover:bg-yellow-100':
        status === TaskStatus.IN_PROGRESS,

      'bg-green-50 text-green-700 hover:bg-green-100':
        status === TaskStatus.COMPLETED,

      'font-semibold ring-1 ring-gray-300':
        status === this.task.status
    };
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if(!this.elementRef.nativeElement.contains(event.target)) {
      this.showDropdown = false;
    }
  }
}