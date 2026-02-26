import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../../service/task/task-service';
import { AddTask } from '../add-task/add-task';
import { TaskCard } from '../task-card/task-card';

import { ToastrService } from 'ngx-toastr';

import { TaskRequest } from '../../models/task/task-request.model';
import { TaskResponse } from '../../models/task/task-response.model';
import { TaskStatus } from '../../models/task-status';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AddTask, TaskCard],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  selectedFilter: 'ALL' | 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED' = 'ALL';
  isAddTaskOpen = false;

  tasks: TaskResponse[] = [];

  filteredTasks: TaskResponse[] = [];

  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  private loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (res: TaskResponse[]) => {
        setTimeout(() => {
          this.tasks = res;
          this.updateFilteredTasks();
          this.cdr.markForCheck();
          console.log('Loaded tasks:', res);
        });
      },
      error: (err) => {
        const msg =
          err?.error?.errorMessage ?? err?.message ?? 'Something went wrong. Please try again.';
        this.toastr.error(msg);
        this.cdr.markForCheck();
      },
    });
  }

  openAddTask(): void {
    this.isAddTaskOpen = true;
  }

  closeAddTask(): void {
    this.isAddTaskOpen = false;
  }

  createTask(data: TaskRequest): void {
    this.taskService.addTask(data).subscribe({
      next: (res: TaskResponse) => {
        setTimeout(() => {
          this.toastr.success('Added Successfully', 'Success', { timeOut: 1500 });
          console.log('Created task:', res);
          this.tasks = [...this.tasks, res];
          this.updateFilteredTasks();
          this.closeAddTask();
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        const msg =
          err?.error?.errorMessage ?? err?.message ?? 'Something went wrong. Please try again.';
        this.toastr.error(msg);
      },
    });
  }

  private updateFilteredTasks(): void {
    if (this.selectedFilter === 'ALL') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter((task) => task.status === this.selectedFilter);
    }
  }

  changeFilter(filter: 'ALL' | 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED'): void {
    this.selectedFilter = filter;
    this.updateFilteredTasks();
    this.cdr.markForCheck();
  }

  get totalCount(): number {
    return this.tasks.length;
  }

  get todoCount(): number {
    return this.tasks.filter((t) => t.status === 'TO_DO').length;
  }

  get inProgressCount(): number {
    return this.tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  }

  get completedCount(): number {
    return this.tasks.filter((t) => t.status === 'COMPLETED').length;
  }

  handleDelete(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        setTimeout(() => {
          this.toastr.success('Deleted Successfully', 'Success', { timeOut: 1500 });
          this.tasks = this.tasks.filter((t) => t.id !== taskId);
          this.updateFilteredTasks();
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.errorMessage ?? err?.message ?? 'Something went wrong. Please try again.',
        );
        this.cdr.markForCheck();
      },
    });
  }

  handleStatusChange(event: { id: number; status: TaskStatus }): void {
    this.taskService.updateStatus(event.id, event.status).subscribe({
      next: () => {
        setTimeout(() => {
          this.toastr.success('Status Updated Successfully', 'Success', { timeOut: 1500 });
          const taskIndex = this.tasks.findIndex((t) => t.id === event.id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex].status = event.status;
            this.updateFilteredTasks();
          }
          this.cdr.markForCheck();
        });
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.errorMessage ?? err?.message ?? 'Something went wrong. Please try again.',
        );
        this.cdr.markForCheck();
      },
    });
  }
}
