import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../../service/task/task-service';
import { AddTask } from '../add-task/add-task';
import { TaskCard } from '../task-card/task-card';
import { TaskModal } from '../task-modal/task-modal';

import { ToastrService } from 'ngx-toastr';

import { TaskRequest } from '../../models/task/task-request.model';
import { Task } from '../../models/task/task-response.model';
import { TaskStatus } from '../../models/task-status';
import { UpdateTaskRequest } from '../../models/task/update-taskrequest.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, AddTask, TaskCard, TaskModal],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

  // ============================================================================
  // ENUM ACCESS (For Template)
  // ============================================================================
  TaskStatus = TaskStatus;

  // ============================================================================
  // STATE VARIABLES
  // ============================================================================
  selectedFilter: TaskStatus | 'ALL' = 'ALL';
  isAddTaskOpen = false;

  selectedTask: Task | null = null;
  isEditing = false;

  tasks: Task[] = [];
  filteredTasks: Task[] = [];

  // ============================================================================
  // CONSTRUCTOR
  // ============================================================================
  constructor(
    private taskService: TaskService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  // ============================================================================
  // LIFECYCLE
  // ============================================================================
  ngOnInit(): void {
    this.loadTasks();
  }

  // ============================================================================
  // ---------------------- MODAL (View / Edit) METHODS -------------------------
  // ============================================================================

  openModal(task: Task, editMode: boolean = false): void {
    this.selectedTask = { ...task };
    this.isEditing = editMode;
  }

  closeModal(): void {
    this.selectedTask = null;
    this.isEditing = false;
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  saveEdit(updatedTask: Task): void {
    const payload: UpdateTaskRequest = {
      title: updatedTask.title,
      description: updatedTask.description,
      dueDate: updatedTask.dueDate,
    };

    this.taskService.updateTask(updatedTask.id, payload).subscribe({
      next: (res) => {
        this.toastr.success('Task Updated Successfully', 'Success', { timeOut: 1500 });

        this.tasks = this.tasks.map(task =>
          task.id === res.id ? res : task
        );

        this.updateFilteredTasks();
        this.closeModal();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.errorMessage ??
          err?.message ??
          'Something went wrong. Please try again.'
        );
      }
    });
  }

  // ============================================================================
  // ---------------------- ADD TASK MODAL METHODS ------------------------------
  // ============================================================================

  openAddTask(): void {
    this.isAddTaskOpen = true;
  }

  closeAddTask(): void {
    this.isAddTaskOpen = false;
  }

  createTask(data: TaskRequest): void {
    this.taskService.addTask(data).subscribe({
      next: (res: Task) => {
        this.toastr.success('Added Successfully', 'Success', { timeOut: 1500 });

        this.tasks = [...this.tasks, res];
        this.updateFilteredTasks();
        this.closeAddTask();
        this.cdr.markForCheck();
      },
      error: (err) => {
        const msg =
          err?.error?.errorMessage ??
          err?.message ??
          'Something went wrong. Please try again.';

        this.toastr.error(msg);
      }
    });
  }

  // ============================================================================
  // ---------------------- TASK CARD ACTIONS ----------------------------------
  // ============================================================================

  handleDelete(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.toastr.success('Deleted Successfully', 'Success', { timeOut: 1500 });

        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.updateFilteredTasks();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.errorMessage ??
          err?.message ??
          'Something went wrong. Please try again.'
        );
      }
    });
  }

  handleStatusChange(event: { id: number; status: TaskStatus }): void {
    this.taskService.updateStatus(event.id, event.status).subscribe({
      next: () => {
        this.toastr.success('Status Updated Successfully', 'Success', { timeOut: 1500 });

        this.tasks = this.tasks.map(task =>
          task.id === event.id
            ? { ...task, status: event.status }
            : task
        );

        this.updateFilteredTasks();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toastr.error(
          err?.error?.errorMessage ??
          err?.message ??
          'Something went wrong. Please try again.'
        );
      }
    });
  }

  // ============================================================================
  // ---------------------- FILTER METHODS --------------------------------------
  // ============================================================================

  changeFilter(filter: TaskStatus | 'ALL'): void {
    this.selectedFilter = filter;
    this.updateFilteredTasks();
    this.cdr.markForCheck();
  }

  private updateFilteredTasks(): void {
    if (this.selectedFilter === 'ALL') {
      this.filteredTasks = this.tasks;
    } else {
      this.filteredTasks = this.tasks.filter(
        task => task.status === this.selectedFilter
      );
    }
  }

  // ============================================================================
  // ---------------------- DATA LOADING ----------------------------------------
  // ============================================================================

  private loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (res: Task[]) => {
        this.tasks = res;
        this.updateFilteredTasks();
        this.cdr.markForCheck();
      },
      error: (err) => {
        const msg =
          err?.error?.errorMessage ??
          err?.message ??
          'Something went wrong. Please try again.';

        this.toastr.error(msg);
      }
    });
  }

  // ============================================================================
  // ---------------------- COMPUTED COUNTS -------------------------------------
  // ============================================================================

  get totalCount(): number {
    return this.tasks.length;
  }

  get todoCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.TO_DO).length;
  }

  get inProgressCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  }

  get completedCount(): number {
    return this.tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  }
}