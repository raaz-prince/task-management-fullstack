import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskRequest } from '../../models/task/task-request.model';
import { Observable } from 'rxjs';
import { TaskResponse } from '../../models/task/task-response.model';
import { TaskStatus } from '../../models/task-status';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  private readonly API_URL = 'http://localhost:8080/api/tasks';
  private readonly TOKEN_KEY = 'jwt';

  getAllTasks(): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${this.API_URL}/get-tasks`);
  }

  addTask(task: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(`${this.API_URL}/add-task`, task);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/delete-task/${id}`);
  }

  updateStatus(id: number, staus: TaskStatus): Observable<any> {
    return this.http.put(`${this.API_URL}/update-status/${id}?status=${staus}`, {});
  }
}
