import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../service/task-service';
import { Task } from '../../models/task/task.model';
import { TaskCard } from '../task-card/task-card';
import { AddTask } from '../add-task/add-task';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TaskCard, AddTask],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  tasks: Task[] = [];
  selectedFilter: 'ALL' | 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED' = 'ALL';

  isAddTaskOpen: boolean = false;

  constructor(private taskService: TaskService){}

  ngOnInit(): void {
    this.tasks = [
      { id: 1, title: 'Design UI', description: 'Create dashboard layout', status: 'TO_DO' },
      { id: 2, title: 'Build API', description: 'Spring Boot backend', status: 'IN_PROGRESS' },
      { id: 3, title: 'Testing', description: 'Write unit tests', status: 'COMPLETED' }
    ];
  }

  openAddTask() {
    this.isAddTaskOpen = true;
  }

  closeAddTask() {
    this.isAddTaskOpen = false;
  }

  get filteredTasks(): Task[] {
    if(this.selectedFilter === 'ALL') {
      return this.tasks;
    }
    return this.tasks.filter(task => task.status === this.selectedFilter);
  }

  changeFilter(filter: 'ALL' | 'TO_DO' | 'IN_PROGRESS' | 'COMPLETED'): void {
    this.selectedFilter = filter;
  }

  get totalCount(): number {
    return this.tasks.length;
  }

  get todoCount(): number {
    return this.tasks.filter(task => task.status === 'TO_DO').length;
  }

  get inProgressCount(): number {
    return this.tasks.filter(task => task.status === 'IN_PROGRESS').length;
  }

  get completedCount(): number {
    return this.tasks.filter(task => task.status === 'COMPLETED').length;
  }

}
